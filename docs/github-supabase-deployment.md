# GitHub and Supabase deployment

## Current preparation versus launch

The GitHub Pages build runs without Replit's `PORT` or managed Clerk tenant.
Product links, checkout links, and private receipt fragments survive Pages
refreshes using `404.html`. Receipt access tokens stay in the fragment during
the Pages redirect, not in a query sent to GitHub.

No custom deployment workflow is installed. GitHub Pages is configured to serve
`main` from the repository root at the custom domain `minicattlefarm.com`.
The generated static output is provided both at the root and in `docs/`, allowing
either publishing folder. Keep `.nojekyll` and `CNAME` in the selected folder.
Merging a release pull request into `main` updates the live site.

## Frontend configuration

### Admin update

The production admin panel is part of the GitHub-hosted frontend at `/admin`.
Its authentication, authorization, inventory, orders, earnings and anonymous
traffic data use Supabase. No Replit production hosting is needed.

Deployment order matters: apply the additive admin migration and update the
Supabase checkout function **before** releasing the new frontend. Existing
crypto receipts and inventory must never be reseeded.

- Secure owner setup: `node scripts/src/admin-release.mjs --bootstrap-owner`.
  Requires the managing owner's securely supplied `ADMIN_INITIAL_PASSWORD`
  (12+ characters). The password is not embedded in frontend builds or logged.
  Existing accounts' passwords are never silently replaced.
- After explicit publication approval:
  `node scripts/src/admin-release.mjs --approved-publish-backend --site-origin=https://minicattlefarm.com`.
  Creates protected analytics tables and the public livestock photo bucket;
  uploads remain accessible only through authenticated owner API requests.
- Build with `pnpm --filter @workspace/mini-cattle-farm run build:pages`;
  export the approved source and built site using the existing release manifest.
- Bank requests do not reserve animals and are not paid until the owner verifies
  actual funds and the confirmation transaction checks available stock.
- Earnings are confirmed USD sales revenue on the payment-confirmation date
  in Africa/Lagos, not profit or processor settlement. Sandbox orders are excluded.
- Traffic counts anonymous browser sessions and page views starting when the
  tracking update goes live. Private/admin routes, query strings and receipt
  tokens are excluded; Do Not Track and Global Privacy Control are respected.

Create an ignored `.env.production.local` inside `artifacts/mini-cattle-farm`
with the selected Supabase project URL and **publishable/anon** browser key.
Use the variable names in `.env.example`. Never enter a service-role key there.
Build with `BASE_PATH=/` for `minicattlefarm.com`. Copy the output into the
configured publishing folder without deleting source files or changing `CNAME`;
the current release mirrors it at the root and in `docs/`. A custom-domain site
must not be built with the repository prefix `/mincettlefarm/`.

Until these values and the Edge Function exist, storefront browsing works but
sign-in is explicitly unavailable and payment submission is disabled.

## Backend setup

1. Select the approved Supabase project. Before applying schema or importing
   data, back up any existing tables and compare schemas. Do not overwrite a
   populated project's tables blindly.
2. Apply `supabase/migrations/202610030001_sandbox_checkout.sql`. The three
   sandbox tables have RLS enabled and no browser table privileges. This does
   not populate or modify real herd quantities.
3. Generate the function's shared engine using
   `node scripts/src/prepare-supabase.mjs`. Its database and validation rules
   come from the existing checkout source, not a separate payment implementation.
4. Configure these **server-only** Edge Function secrets securely:
   - `OXAPAY_MERCHANT_API_KEY`
   - `SESSION_SECRET`
   - `OWNER_SUPABASE_USER_IDS` (explicit approved user UUIDs, comma-separated)
   - `MCF_SANDBOX_PUBLIC_URL` (actual HTTPS website base URL, including its repo path)
   - `MCF_SANDBOX_CALLBACK_URL` (the function's `/api/payments/oxapay/callback` endpoint)
   - `CHECKOUT_SANDBOX_ENABLED=true` only after endpoint checks
   - `MCF_RECONCILE_SECRET` (an independent strong server secret)
   - Optional `CHECKOUT_DATABASE_URL` for the project's TLS transaction pooler;
     otherwise the function uses Supabase's provided `SUPABASE_DB_URL`.
5. Deploy `checkout` with the provided configuration. Gateway JWT checks are
   disabled for this function because OxaPay cannot send a Supabase JWT.
   This does not make owner access public: owner requests are separately verified
   against the project's Auth service and the explicit user allowlist.
6. Create the owner's verified email/password account securely in Supabase Auth.
   Add only its approved UUID to the server allowlist. Configure the Auth site's
   URL and disable public signup if not needed. Keep the existing Clerk tenant
   until the replacement is verified; passwords and sessions are not copied.
7. Configure Vault values named `mcf_checkout_function_url` and
   `mcf_reconcile_secret`, matching the function URL and server secret. Then run
   `supabase/setup-reconciliation.sql`. The minute-based job checks abandoned
   invoices against OxaPay; elapsed time alone never releases a reservation.
8. Verify anonymous/unauthorized owner denial, sandbox order creation, private
   receipt access, callback signatures/retries, duplicate requests, and stock
   release. Do not enable real payments through this migration.

The API lives under `/functions/v1/checkout/api/...`. CORS allows the configured
website origin only. The callback requires an exact-byte HMAC signature plus
authoritative invoice validation; the scheduled endpoint requires its own secret.
The frontend never calls OxaPay directly.

## Existing data and rollback

Do not export buyer records into GitHub. Transfer them using secure database
tools after a source backup and approved destination are available.

Preserve order IDs, request IDs, hashes, buyer/line snapshots, cents totals,
invoice references, reservation state, and timestamps. Preserve the original
`SESSION_SECRET` when carrying existing receipts over: rotating it invalidates
derived receipt tokens. Stock totals must account for existing reservations.

Before cutover, pause new checkout on the old backend and take a consistent
database backup. Prevent two independent backends from accepting orders against
duplicated inventory. Existing OxaPay invoices retain their old callback URLs;
keep the old verified callback handler available until those invoices are
terminal or a provider-approved transition is verified.

Keep the source database and hosting intact until row counts, order/inventory
invariants, private receipts, and callback delivery match on the new system.
Rollback requires a consistent reservation/order ledger, not simply repointing
the frontend while both backends accept orders.

## Owner-approved live checkout

The owner subsequently requested real checkout and approved the displayed listing
prices and one animal per in-stock listing. Apply the separate
`202610030002_live_checkout.sql` migration; never copy artificial sandbox quantities
or test orders into its tables. Stock is reserved transactionally, and repeated
activation never overwrites sold or reserved quantities.

Live Edge Functions select only the protected `live_checkout_*` tables. Set
`CHECKOUT_LIVE_ENABLED=true` and `CHECKOUT_SANDBOX_ENABLED=false` exclusively.
The existing `MCF_SANDBOX_PUBLIC_URL` and `MCF_SANDBOX_CALLBACK_URL` variable names
are retained for compatibility but now hold the verified production website and
function callback URLs. Live OxaPay requests explicitly use `sandbox: false`.
The original Replit preview remains isolated on its test database.

Run `node scripts/src/prepare-supabase.mjs`, then the explicitly approved,
project-scoped `node scripts/src/activate-live-checkout.mjs --approved-live`.
It consumes saved server credentials without printing them, preserves the
separate reconciliation credential in Vault, and schedules verified reconciliation.
The public Supabase root CA is included; TLS verification is never disabled.

New checkout pages send `x-mcf-checkout-client: live-v1`. Older cached pages that
describe payments as test-only cannot create real invoices. This release marker
is not authentication: order validation, trusted pricing, stock locks, private
receipt tokens, callback HMAC and canonical OxaPay verification remain mandatory.
Publish the matching frontend through a reviewed GitHub pull request.

Bank transfer is unavailable until the owner supplies valid bank details.
No unapproved owner account is granted access. The contact form uses a pre-filled
email draft because the owner declined a new email-sending connection; visitors
must finish sending in their own email app.