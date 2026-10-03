# Mini Cattle Farm

Static React storefront and owner interface, with a Supabase sandbox checkout
backend. GitHub contains source code; committing source does not activate
payments or publish a site.

## Build the static website

Use Node.js 24 and pnpm 10.26.1.

```sh
pnpm install --frozen-lockfile
BASE_PATH=/mincettlefarm/ pnpm --filter @workspace/mini-cattle-farm run build:pages
```

Output: `artifacts/mini-cattle-farm/dist/public`. For a custom domain or an
account-root Pages site, build with `BASE_PATH=/` instead.

For owner login and checkout, configure the project's **public browser** values
from `artifacts/mini-cattle-farm/.env.example` before building. Never use a secret
or service-role key in frontend configuration.

The prepared `docs/` output can be selected manually in GitHub Pages settings:
**Deploy from a branch → main → /docs**. No deployment workflow is installed.
GitHub Pages' restrictions on commercial storefronts remain the owner's
responsibility; using Supabase for transactions does not remove them.

## Supabase backend

```sh
node scripts/src/prepare-supabase.mjs
```

This bundles the existing order/reservation engine for Supabase Edge Functions.
Apply `supabase/migrations/`, configure server secrets, and deploy the
`checkout` function only to the selected project. Follow
[the deployment guide](docs/github-supabase-deployment.md).

**Sandbox only. Do not send real funds.** Bank transfer is unavailable. Public
account signup never grants owner access. A prepared static site does not mean
owner login, callbacks, reconciliation, or data transfer have been verified.