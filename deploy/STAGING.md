# Staging: testing the Finance & Payroll module

A second, fully isolated deployment of the `Stage` branch on the same VPS
as production (`72.61.17.109`), for testing the Finance & Payroll module
before it merges to `main`. Separate containers, separate Postgres
database/volume, separate subdomain — nothing here can touch production
data, and nothing in production can see staging's.

Live at `https://staging.app.aishaquran.com` once DNS + certs are set up
(see below). There is no staging build of the public marketing site
(`AishaQuranAcademyFE`) — this module never touched it.

## Layout on the VPS

```
/opt/aisha-staging/
├── AishaQuranAcademyBE/    (git clone, Stage branch)
├── AishaQuranAcademyDB/    (git clone, Stage branch)
└── deploy/
    ├── docker-compose.staging.yml
    ├── .env.staging          (real secrets, gitignored, root-only)
    ├── nginx/
    └── redeploy-staging.sh
```

Same shape as `/opt/aisha` (production, `main` branch — see `DEPLOY.md`),
just a sibling directory tracking `Stage` instead, with its own compose
file, env file, and only the 2 repos this module actually touches.

## First-time setup

```bash
ssh -i ~/.ssh/id_aisha_vps root@72.61.17.109
mkdir -p /opt/aisha-staging
git clone git@github.com:OmarBaiomay/AishaQuranAcademy.git /opt/aisha-staging
cd /opt/aisha-staging
git checkout Stage
rmdir AishaQuranAcademyBE AishaQuranAcademyDB AishaQuranAcademyFE   # empty gitlink placeholders
git clone -b Stage git@github.com:OmarBaiomay/AishaQuranAcademyBE.git
git clone -b Stage git@github.com:OmarBaiomay/AishaQuranAcademyDB.git
rm -rf AishaQuranAcademyFE   # not needed for staging (see above)
```

Fill in real secrets:

```bash
cd /opt/aisha-staging/deploy
cp .env.staging.example .env.staging
chmod 600 .env.staging
nano .env.staging
```

Use **different** values from production's `.env.production` wherever it
matters — a separate `POSTGRES_PASSWORD`, `JWT_SECRET`, and especially
`PAYOUT_ENCRYPTION_KEY` (`openssl rand -base64 32`; staging and production
must never be able to decrypt each other's payout-account data). For
PayPal, use a **sandbox** app's credentials (`PAYPAL_MODE=sandbox`), never
the live ones — this is a testing environment.

Build and start:

```bash
cd /opt/aisha-staging/deploy
docker compose --env-file .env.staging -f docker-compose.staging.yml up -d --build
docker compose --env-file .env.staging -f docker-compose.staging.yml ps
```

The backend's container `CMD` runs `npx prisma migrate deploy` before
starting, same as production — the schema (including every Finance &
Payroll migration) is created automatically on first boot, against a
brand-new, empty staging database.

Verify directly via localhost ports (before nginx/DNS):

```bash
curl -s http://127.0.0.1:3022/health          # staging backend
curl -sI http://127.0.0.1:3021/                # staging dashboard
```

### Wire up the system nginx vhost

```bash
cp deploy/nginx/staging.app.aishaquran.com.conf /etc/nginx/sites-available/staging.app.aishaquran.com
ln -s /etc/nginx/sites-available/staging.app.aishaquran.com /etc/nginx/sites-enabled/staging.app.aishaquran.com
nginx -t && systemctl reload nginx
```

### DNS + certificate

Add one DNS record (Hostinger): `staging.app` → A `72.61.17.109`. Once it
resolves:

```bash
certbot --nginx -d staging.app.aishaquran.com --non-interactive --agree-tos -m support@aishaquran.com --redirect
```

Consider adding HTTP basic auth or an IP allowlist in the nginx vhost too
(see the commented-out note in the conf file) — a staging dashboard with
realistic-looking demo data is still a public URL once DNS resolves.

### Create an Administrator account, then generate demo data

```bash
docker compose --env-file .env.staging -f docker-compose.staging.yml exec backend \
  node scripts/createSuperAdmin.js \
  --email=admin@aishaquran.com --password='ChooseAStrongOne123!' \
  --name='Staging Admin' --country='Saudi Arabia' --gender=Male \
  --countryCode=+966 --phone=500000000

docker compose --env-file .env.staging -f docker-compose.staging.yml exec backend \
  npm run seed:finance-reference   # currencies, payment methods — required once, before any finance data
```

Then log in as that Administrator on `https://staging.app.aishaquran.com`
and click **Finance & Payroll → Demo Data → Generate Demo Data** — or run
it from the command line instead:

```bash
docker compose --env-file .env.staging -f docker-compose.staging.yml exec backend \
  npm run seed:finance-demo
```

This creates the full test scenario (`teacher1@demo.com` .. — password
`123456` for every demo account) described in
`AishaQuranAcademyBE/services/financeDemoDataService.js`'s header comment:
a teacher rate-carded at $3.00 USD/hour but paid out in EGP, students
billed $8.00 USD/hour or its equivalent across USD/EGP/SAR, spanning July
through today at different payroll lifecycle stages. Safe to click/run
again any time — it always resets every `@demo.com` row first.

## Everyday redeploy

After pushing changes to `Stage` on the backend or dashboard repos:

```bash
ssh -i ~/.ssh/id_aisha_vps root@72.61.17.109 "/opt/aisha-staging/deploy/redeploy-staging.sh"
```

Same behavior as production's `redeploy.sh`: only rebuilds/recreates
services whose image or config changed, never touches the staging
Postgres volume, safe to re-run any time.

## Promoting to production

Once the Finance & Payroll module has been tested here to satisfaction,
merge `Stage` into `main` on the backend and dashboard repos (a normal PR
merge — nothing staging-specific to unwind), add the new
`PAYOUT_ENCRYPTION_KEY`/`PAYPAL_*` variables to production's
`docker-compose.prod.yml` and `.env.production` (see `.env.staging.example`
for the full list — production needs its own **live** PayPal credentials
and its own, different `PAYOUT_ENCRYPTION_KEY`, not staging's), then
redeploy production as usual via `deploy/redeploy.sh`. The staging stack
can keep running afterward for the next round of testing, or be torn down
with `docker compose --env-file .env.staging -f docker-compose.staging.yml down -v`.
