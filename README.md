# Mini Cattle Farm

Static React storefront and owner interface, with a Supabase OxaPay checkout
backend. GitHub contains source code; committing source does not activate
payments or publish a site.

## Build the static website

Use Node.js 24 and pnpm 10.26.1.

```sh
pnpm install --frozen-lockfile
BASE_PATH=/ pnpm --filter @workspace/mini-cattle-farm run build:pages
```

Output: `artifacts/mini-cattle-farm/dist/public`. The configured custom domain
is `minicattlefarm.com`, so asset and navigation paths must start at `/`, not
`/mincettlefarm/`. The public `CNAME` file preserves the domain across rebuilds.

For a repository-path site without a custom domain, use
`BASE_PATH=/mincettlefarm/` and remove `CNAME` from that published output.

For owner login and checkout, configure the project's **public browser** values
from `artifacts/mini-cattle-farm/.env.example` before building. Never use a secret
or service-role key in frontend configuration.

GitHub Pages currently uses **Deploy from a branch → main → /(root)**.
Copy the generated output to the repository root, preserving source files and
the domain's `CNAME`. The same output is mirrored in `docs/`, so selecting
**main → /docs** also works. Keep `.nojekyll` in either publishing folder.
No deployment workflow is installed. Changes in the selected publishing folder
take effect when merged into `main`; review release pull requests before merging.
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

Live checkout uses separate protected `live_checkout_*` tables. The managing
owner approved the displayed listing prices and one animal per in-stock listing.
Existing test quantities and orders remain separate and are never converted into
real inventory. Bank transfer remains unavailable until valid details are supplied.
Public account signup never grants owner access.

New checkout pages send `x-mcf-checkout-client: live-v1`; older cached sandbox
pages cannot create real invoices. Payment is confirmed only through verified
OxaPay information, never by a redirect or a browser assertion.

The contact form opens a pre-filled email draft. Visitors must press Send in their
email app; it does not claim automatic email delivery.