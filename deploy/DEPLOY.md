# Deploying Aisha Quran Academy to the VPS

Target: Ubuntu 24.04 VPS at `72.61.17.109` (hostname `srv1856438`), Docker
Compose stack = Postgres + backend API + public site + dashboard + Caddy
(automatic HTTPS). No live data migration — this is a fresh database; the
old Mongo/Atlas cluster is gone and was already confirmed abandoned.

Everything below assumes you're running it **on the VPS**, connected as
`root@72.61.17.109` over the dedicated deploy key:

```bash
ssh -i ~/.ssh/id_aisha_vps root@72.61.17.109
```

---

## 1. One-time server setup

Install Docker Engine + the Compose plugin (Docker's official convenience
script, fine for a fresh Ubuntu box you control):

```bash
curl -fsSL https://get.docker.com | sh
docker --version && docker compose version
```

Open the firewall for HTTP/HTTPS (SSH should already be allowed — don't
lock yourself out):

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable   # only if ufw isn't already active; check with `ufw status` first
```

## 2. Get the code onto the box

Three sibling app repos + this `deploy/` folder need to sit next to each
other, matching the relative `context: ../AishaQuranAcademy*` paths in
`docker-compose.yml`:

```bash
mkdir -p /opt/aisha && cd /opt/aisha
git clone -b postgres-migration <BE_REMOTE_URL> AishaQuranAcademyBE
git clone -b product-review-fixes <DB_REMOTE_URL> AishaQuranAcademyDB
git clone -b product-review-fixes <FE_REMOTE_URL> AishaQuranAcademyFE
```

Copy `deploy/` itself over (it lives in the parent orchestration repo, not
one you'd typically clone standalone on the server) — easiest is `scp -r`
from your machine:

```bash
# from your local machine, not the VPS
scp -i ~/.ssh/id_aisha_vps -r "deploy" root@72.61.17.109:/opt/aisha/deploy
```

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

## 5. Verify directly via the VPS IP (before DNS points here)

Caddy needs a real `Host` header matching the Caddyfile's site blocks to
route correctly, so test with `curl --resolve` rather than hitting the
bare IP:

```bash
curl -sk --resolve aishaquran.com:443:72.61.17.109 https://aishaquran.com/api/health
curl -sk --resolve app.aishaquran.com:443:72.61.17.109 https://app.aishaquran.com/api/health
```

Note: Caddy will try to get a real Let's Encrypt cert on startup for every
domain in the Caddyfile, which will fail/retry until DNS actually points
here (that's expected and harmless — it keeps retrying in the background).
Until then, `curl -sk` (the `-k` skips cert verification) against the
self-signed fallback is enough to confirm the app itself is wired up
correctly end to end.

## 6. Create the real super-admin account

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

## 7. DNS cutover (only after step 5 passes)

Once the stack is confirmed healthy against the VPS IP directly, update
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

DNS propagation can take anywhere from minutes to a few hours. Once it
resolves, Caddy will automatically obtain real Let's Encrypt certificates
for all four domains — no manual cert step. Re-run the health checks from
step 5 without `--resolve`/`-k` once propagation completes to confirm real
HTTPS is working.

## Common operations

```bash
# View logs
docker compose logs -f [service]

# Restart one service after an env change
docker compose up -d --build backend

# Pull latest code + redeploy everything
cd /opt/aisha/AishaQuranAcademyBE && git pull
cd /opt/aisha/AishaQuranAcademyDB && git pull
cd /opt/aisha/AishaQuranAcademyFE && git pull
cd /opt/aisha/deploy && docker compose up -d --build

# Back up the database
docker compose exec postgres pg_dump -U <POSTGRES_USER> <POSTGRES_DB> > backup-$(date +%F).sql

# Stop everything
docker compose down          # keeps volumes (db data, certs)
docker compose down -v       # DANGER: also deletes the postgres_data volume
```
