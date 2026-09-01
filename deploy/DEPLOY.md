# Deploying Aisha Quran Academy to the VPS

Target: Ubuntu 24.04 VPS at `72.61.17.109` (hostname `srv1856438`). Live at
`https://aishaquran.com` (public site) and `https://app.aishaquran.com`
(dashboard).

**This VPS is shared with other projects** (`arena`/`playstation-lounge`,
`b-code`, `n8n`) and runs a system-level **nginx + certbot** on ports
80/443 in front of all of them (not Dockerized nginx — the actual `nginx`
package, managing per-project vhosts and Let's Encrypt certs). Because of
that, no container in this stack binds host port 80/443 — see `nginx/`
below.

## Layout on the VPS

`/opt/aisha` is a git clone of this repo (`AishaQuranAcademy`, `main`
branch), with the three app repos cloned as siblings inside it — the same
shape as this repo looks on your own machine:

```
/opt/aisha/
├── AishaQuranAcademyBE/    (git clone, main)
├── AishaQuranAcademyDB/    (git clone, main)
├── AishaQuranAcademyFE/    (git clone, main)
└── deploy/
    ├── docker-compose.prod.yml
    ├── .env.production      (real secrets, gitignored, root-only)
    ├── nginx/
    └── redeploy.sh
```

SSH access: `ssh -i ~/.ssh/id_aisha_vps root@72.61.17.109` (dedicated
deploy key). GitHub access from the VPS: a separate key at
`/root/.ssh/id_github_deploy`, added as an SSH key on the GitHub account
(read/write on all your repos, not scoped per-repo — see the commit that
introduced it if you want the tradeoffs again).

## Everyday deploy

After pushing changes to `main` on any of the 4 repos:

```bash
ssh -i ~/.ssh/id_aisha_vps root@72.61.17.109 "/opt/aisha/deploy/redeploy.sh"
```

This pulls `main` on all 4 repos and runs:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

Only services whose image or config actually changed get recreated —
Docker's build cache skips everything else. Postgres and its data volume
are never touched by this. Safe to re-run any time.

---

## Setting this up from scratch (reference — already done once)

### 1. One-time server setup

Docker, Compose, `ufw` (80/443 open), and the system nginx + certbot were
already present on this box before this project existed (used by the
other projects it hosts). Nothing to install. On a genuinely fresh box:

```bash
curl -fsSL https://get.docker.com | sh
ufw allow OpenSSH && ufw allow 80/tcp && ufw allow 443/tcp && ufw enable
```

### 2. GitHub access from the VPS

```bash
ssh-keygen -t ed25519 -f /root/.ssh/id_github_deploy -N "" -C "aisha-vps-github"
cat /root/.ssh/id_github_deploy.pub   # add to github.com/settings/keys
```

`/root/.ssh/config`:
```
Host github.com
  HostName github.com
  User git
  IdentityFile /root/.ssh/id_github_deploy
  IdentitiesOnly yes
```

### 3. Clone everything

```bash
mkdir -p /opt/aisha
git clone git@github.com:OmarBaiomay/AishaQuranAcademy.git /opt/aisha
cd /opt/aisha
rmdir AishaQuranAcademyBE AishaQuranAcademyDB AishaQuranAcademyFE   # empty gitlink placeholders
git clone git@github.com:OmarBaiomay/AishaQuranAcademyBE.git
git clone git@github.com:OmarBaiomay/AishaQuranAcademyDB.git
git clone git@github.com:OmarBaiomay/AishaQuranAcademyFE.git
```

### 4. Fill in real secrets

```bash
cd /opt/aisha/deploy
cp .env.production.example .env.production
chmod 600 .env.production
nano .env.production   # fill in every blank value
```

Needed: a strong random `POSTGRES_PASSWORD`, a long random `JWT_SECRET`
(`openssl rand -hex 32`), real Cloudinary/EmailJS/SMTP credentials,
`MAKE_BLOG_SECRET` (`openssl rand -hex 24` — used as a bearer secret; an
unset value is a real hole, see `middleware/auth.middleware.js`),
`FIREBASE_KEY` (single-line JSON, single-quoted — service-account cred
for push notifications), and `REGISTRATION_EMAIL_TO`. `.env.production`
is gitignored — never commit it.

### 5. Build and start

```bash
cd /opt/aisha/deploy
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
docker compose --env-file .env.production -f docker-compose.prod.yml ps
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f backend
```

The backend's container `CMD` runs `npx prisma migrate deploy` before
starting, so the schema is created automatically on first boot.

### 6. Verify directly via localhost ports (before nginx/DNS)

```bash
curl -s http://127.0.0.1:3012/health          # backend (note: unprefixed, not /api/health)
curl -sI http://127.0.0.1:3010/                # frontend
curl -sI http://127.0.0.1:3011/                # dashboard
```

### 7. Wire up the system nginx vhosts

```bash
cp deploy/nginx/aishaquran.com.conf /etc/nginx/sites-available/aishaquran.com
cp deploy/nginx/app.aishaquran.com.conf /etc/nginx/sites-available/app.aishaquran.com
ln -s /etc/nginx/sites-available/aishaquran.com /etc/nginx/sites-enabled/aishaquran.com
ln -s /etc/nginx/sites-available/app.aishaquran.com /etc/nginx/sites-enabled/app.aishaquran.com
nginx -t && systemctl reload nginx
```

### 8. Create the real super-admin account

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml exec backend \
  node scripts/createSuperAdmin.js \
  --email=admin@aishaquran.com --password='ChooseAStrongOne123!' \
  --name='Admin Name' --country='Saudi Arabia' --gender=Male \
  --countryCode=+966 --phone=500000000
```

Do **not** run `npm run seed:dummy` in production — it seeds fake
placeholder rows.

### 9. DNS + certificates

DNS records needed (Hostinger): `@` → A `72.61.17.109`, `app` → A
`72.61.17.109`, `www` → CNAME `aishaquran.com`. Leave MX/SPF/DKIM/DMARC/
autodiscover/autoconfig/Google-verification records untouched — unrelated
to web hosting, needed for existing email.

Once DNS resolves, issue certs the same way the box's other domains got
theirs:

```bash
certbot --nginx -d aishaquran.com -d www.aishaquran.com --non-interactive --agree-tos -m support@aishaquran.com --redirect
certbot --nginx -d app.aishaquran.com --non-interactive --agree-tos -m support@aishaquran.com --redirect
```

Certbot's existing renewal timer picks these up automatically.

---

## Common operations

```bash
COMPOSE="docker compose --env-file .env.production -f docker-compose.prod.yml"
cd /opt/aisha/deploy

$COMPOSE logs -f [service]                 # view logs
$COMPOSE up -d --build [service]           # rebuild one service
$COMPOSE exec postgres pg_dump -U <POSTGRES_USER> <POSTGRES_DB> > backup-$(date +%F).sql
$COMPOSE down                              # stop everything, keeps postgres_data volume
$COMPOSE down -v                           # DANGER: also deletes postgres_data
```
