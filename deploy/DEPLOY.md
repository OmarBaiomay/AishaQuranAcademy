# Deploying Aisha Quran Academy to the VPS

Target: Ubuntu 24.04 VPS at `72.61.17.109` (hostname `srv1856438`), Docker
Compose stack = Postgres + backend API + public site + dashboard. No live
data migration — this is a fresh database; the old Mongo/Atlas cluster is
gone and was already confirmed abandoned.

**This VPS is shared with other projects** (`arena`/`playstation-lounge`,
`b-code`, `n8n`) and already runs a system-level **nginx + certbot** on
ports 80/443 in front of them (not Dockerized nginx — the actual `nginx`
package, managing multiple `sites-available` vhosts and Let's Encrypt certs
for `arenause.com`, `b-code.tech`, `n8n.b-code.tech`). Because of that:

- **No Caddy, no container binds host port 80/443.** This stack's
  `frontend`, `dashboard`, and `backend` containers publish only to
  `127.0.0.1` on ports `3010`/`3011`/`3012` (the box's other apps already
  occupy `3001`/`3002`) — never exposed outside the VPS directly.
- The existing **system nginx** gets two new vhosts (`deploy/nginx/*.conf`,
  below) that proxy `aishaquran.com`/`app.aishaquran.com` to those local
  ports, same pattern as the box's existing `b-code-app` vhost.
- **certbot** (already installed, already managing the other domains'
  certs) issues certs for these two domains the same way — no new TLS
  tooling introduced.

Everything below assumes you're running it **on the VPS**, connected as
`root@72.61.17.109` over the dedicated deploy key:

```bash
ssh -i ~/.ssh/id_aisha_vps root@72.61.17.109
```

## 1. One-time server setup

Docker, Compose, and `ufw` (80/443 already open) are already present on
this box — confirmed, nothing to install. If you're ever repeating this on
a genuinely fresh box instead, you'd need:

```bash
curl -fsSL https://get.docker.com | sh
ufw allow OpenSSH && ufw allow 80/tcp && ufw allow 443/tcp && ufw enable
```

## 2. Get the code onto the box

The three repos' `origin` remotes are SSH (`git@github.com:...`), which
would mean provisioning a GitHub deploy key on the VPS just for this.
Simpler: `rsync` the working trees straight from your machine, the same
way `deploy/` itself has to get there anyway. Run this from your local
machine (the parent folder containing all three repos), not the VPS:

```bash
mkdir -p /opt/aisha   # one-time, on the VPS
for d in AishaQuranAcademyBE AishaQuranAcademyDB AishaQuranAcademyFE deploy; do
  rsync -az --delete -e "ssh -i ~/.ssh/id_aisha_vps" \
    --exclude node_modules --exclude dist --exclude .env --exclude .git \
    "$d/" "root@72.61.17.109:/opt/aisha/$d/"
done
```

Re-run the same loop any time you want to push local changes to the VPS —
`--delete` keeps the remote copy an exact mirror, `--exclude .env` never
overwrites the secrets file you fill in on the box in step 3.

## 3. Fill in real secrets

```bash
cd /opt/aisha/deploy
cp .env.example .env
nano .env   # or vim — fill in every blank value
```

Needed: a strong random `POSTGRES_PASSWORD`, a long random `JWT_SECRET`
(e.g. `openssl rand -hex 32`), the real Cloudinary/EmailJS/SMTP
credentials, and `MAKE_BLOG_SECRET`. `.env` is already gitignored — never
commit it.

## 4. Build and start the stack

```bash
cd /opt/aisha/deploy
docker compose up -d --build
```

First build pulls base images and compiles both Vite frontends — expect a
few minutes. Watch it come up:

```bash
docker compose ps
docker compose logs -f backend
```

The backend's container `CMD` runs `npx prisma migrate deploy` before
starting the server, so the schema is created automatically on first boot
— no separate migration step needed for a fresh database.

## 5. Verify directly via the VPS IP (before DNS or nginx point here)

Before touching the system nginx at all, confirm each container answers
correctly on its own localhost port:

```bash
curl -s http://127.0.0.1:3012/health          # backend
curl -sI http://127.0.0.1:3010/                # frontend (expect 200)
curl -sI http://127.0.0.1:3011/                # dashboard (expect 200)
```

## 6. Wire up the system nginx vhosts

Copy the two vhost files from this repo onto the box and enable them
(HTTP-only for now — certbot adds the HTTPS server blocks itself):

```bash
# from your local machine
scp -i ~/.ssh/id_aisha_vps deploy/nginx/aishaquran.com.conf root@72.61.17.109:/etc/nginx/sites-available/aishaquran.com
scp -i ~/.ssh/id_aisha_vps deploy/nginx/app.aishaquran.com.conf root@72.61.17.109:/etc/nginx/sites-available/app.aishaquran.com
```

```bash
# on the VPS
ln -s /etc/nginx/sites-available/aishaquran.com /etc/nginx/sites-enabled/aishaquran.com
ln -s /etc/nginx/sites-available/app.aishaquran.com /etc/nginx/sites-enabled/app.aishaquran.com
nginx -t && systemctl reload nginx
```

At this point, with `curl --resolve` pointing the domain at the VPS IP,
the whole path (nginx → container → Postgres) works over plain HTTP even
before DNS or TLS are in place. Note `/health` itself is mounted
unprefixed on the backend (not under `/api`), so it's only checked
directly against the container port (step 5) — through the domain, use
any real `/api/*` route instead:

```bash
curl -s --resolve aishaquran.com:80:72.61.17.109 http://aishaquran.com/api/courses
curl -s --resolve app.aishaquran.com:80:72.61.17.109 http://app.aishaquran.com/api/courses
```

## 7. Create the real super-admin account

Fresh database has no users yet. Run this once, replacing the email and
password:

```bash
docker compose exec backend node scripts/createSuperAdmin.js \
  --email=admin@aishaquran.com \
  --password='ChooseAStrongOne123!' \
  --name='Admin Name' \
  --country=Saudi Arabia \
  --gender=Male \
  --countryCode=+966 \
  --phone=500000000
```

Do **not** run `npm run seed:dummy` in production — that seeds fake
placeholder rows (the same kind of "Dummy Parent" testimonial data that
had to be manually deleted from the dev database earlier).

## 8. DNS cutover (only after step 6 passes)

Once the nginx vhosts are confirmed healthy via `--resolve`, update
Hostinger DNS for `aishaquran.com` — **only** these records, everything
else (MX, SPF, the three `hostingermail-*._domainkey` CNAMEs, DMARC,
`autodiscover`/`autoconfig`, the Google site-verification CNAME) stays
untouched since it's unrelated to web hosting and keeps existing email
service working:

| Record | Type | New value |
|---|---|---|
| `@` | A | `72.61.17.109` |
| `www` | CNAME | `aishaquran.com` (or an A record to the same IP, per Hostinger's rules for the apex-aliased `www`) |
| `app` | A | `72.61.17.109` (currently a self-referential CNAME to `aishaquran.com` — needs to become a direct A record) |
| `www.app` | CNAME | `app.aishaquran.com` |

DNS propagation can take anywhere from minutes to a few hours. Confirm
with `dig +short aishaquran.com` and `dig +short app.aishaquran.com` from
your own machine until both return `72.61.17.109`.

## 9. Issue real certificates

Once DNS resolves to the VPS, request certs the same way the box's other
domains got theirs (`certbot --nginx` auto-edits the vhost files to add
the `listen 443 ssl` blocks and the http→https redirect):

```bash
certbot --nginx -d aishaquran.com -d www.aishaquran.com
certbot --nginx -d app.aishaquran.com -d www.app.aishaquran.com
```

Certbot's existing renewal timer (already running for the box's other
certs) picks these up automatically — no extra cron/systemd setup needed.
Re-run the checks over real HTTPS to confirm:

```bash
curl -s https://aishaquran.com/api/courses
curl -s https://app.aishaquran.com/api/courses
```

## Common operations

```bash
# View logs
docker compose logs -f [service]

# Restart one service after an env change
docker compose up -d --build backend

# Push latest local code + redeploy everything (run from your machine,
# then the compose command on the VPS)
for d in AishaQuranAcademyBE AishaQuranAcademyDB AishaQuranAcademyFE deploy; do
  rsync -az --delete -e "ssh -i ~/.ssh/id_aisha_vps" \
    --exclude node_modules --exclude dist --exclude .env --exclude .git \
    "$d/" "root@72.61.17.109:/opt/aisha/$d/"
done
ssh -i ~/.ssh/id_aisha_vps root@72.61.17.109 "cd /opt/aisha/deploy && docker compose up -d --build"

# Back up the database
docker compose exec postgres pg_dump -U <POSTGRES_USER> <POSTGRES_DB> > backup-$(date +%F).sql

# Stop everything
docker compose down          # keeps the postgres_data volume
docker compose down -v       # DANGER: also deletes the postgres_data volume
```
