#!/usr/bin/env bash
# Manual redeploy: pull latest main on all 4 repos, rebuild anything that
# changed, recreate containers. Run this on the VPS after pushing updates
# to GitHub:
#
#   ssh -i ~/.ssh/id_aisha_vps root@72.61.17.109 "/opt/aisha/deploy/redeploy.sh"
#
# Safe to re-run any time — Docker's build cache skips unchanged layers,
# and `docker compose up -d` only recreates containers whose image or
# config actually changed. Postgres/its data volume are never touched.
set -euo pipefail

ROOT="/opt/aisha"
cd "$ROOT"

echo "==> Pulling latest main"
for repo in . AishaQuranAcademyBE AishaQuranAcademyDB AishaQuranAcademyFE; do
  echo "--- $repo ---"
  git -C "$repo" fetch origin main
  before=$(git -C "$repo" rev-parse HEAD)
  git -C "$repo" reset --hard origin/main
  after=$(git -C "$repo" rev-parse HEAD)
  if [ "$before" != "$after" ]; then
    echo "    updated: $(git -C "$repo" rev-parse --short "$before") -> $(git -C "$repo" rev-parse --short "$after")"
  else
    echo "    no change"
  fi
done

echo "==> Rebuilding and recreating changed services"
cd "$ROOT/deploy"
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build

echo "==> Status"
docker compose --env-file .env.production -f docker-compose.prod.yml ps
