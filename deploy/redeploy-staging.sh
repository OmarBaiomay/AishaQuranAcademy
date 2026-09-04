#!/usr/bin/env bash
# Manual staging redeploy: pull latest Stage branch on the repos this
# module touches (root, backend, dashboard — NOT the public FE site, which
# Finance & Payroll never changed), rebuild anything that changed,
# recreate containers. Run this on the VPS after pushing updates to the
# Stage branch:
#
#   ssh -i ~/.ssh/id_aisha_vps root@72.61.17.109 "/opt/aisha-staging/deploy/redeploy-staging.sh"
#
# Mirrors deploy/redeploy.sh exactly, except: tracks `Stage` instead of
# `main`, only 2 of the 3 app repos, and its own compose file/env file so
# this never touches production's containers, images, or Postgres volume.
set -euo pipefail

ROOT="/opt/aisha-staging"
cd "$ROOT"

echo "==> Pulling latest Stage"
for repo in . AishaQuranAcademyBE AishaQuranAcademyDB; do
  echo "--- $repo ---"
  git -C "$repo" fetch origin Stage
  before=$(git -C "$repo" rev-parse HEAD)
  git -C "$repo" reset --hard origin/Stage
  after=$(git -C "$repo" rev-parse HEAD)
  if [ "$before" != "$after" ]; then
    echo "    updated: $(git -C "$repo" rev-parse --short "$before") -> $(git -C "$repo" rev-parse --short "$after")"
  else
    echo "    no change"
  fi
done

echo "==> Rebuilding and recreating changed services"
cd "$ROOT/deploy"
docker compose --env-file .env.staging -f docker-compose.staging.yml up -d --build

echo "==> Status"
docker compose --env-file .env.staging -f docker-compose.staging.yml ps
