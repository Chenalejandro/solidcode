!#/bin/bash

vercel env pull --environment=production .env.production.local && env $(grep -v '^#' .env.production.local | xargs) pnpx sst deploy --stage production && rm -rf .env.production.local
