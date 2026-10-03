# GitHub and Supabase deployment

## Current preparation versus launch

The GitHub Pages build runs without Replit's `PORT` or managed Clerk tenant.
Product links, checkout links, and private receipt fragments survive Pages
refreshes using `404.html`. Receipt access tokens stay in the fragment during
the Pages redirect, not in a query sent to GitHub.

No deployment workflow automatically runs on push. Selecting GitHub Pages'
`main` branch and `/docs` folder is a separate owner action. After Pages is
enabled, subsequent commits changing that folder can publish updates.

## Frontend configuration

Create an ignored `.env.production.local` inside `artifacts/mini-cattle-farm`
with the selected Supabase project URL and **publishable/anon** browser key.
Use the variable names in `.env.example`. Never enter a service-role key there.
Build with the correct `BASE_PATH` and copy the output into `docs/`.

Until these values and the Edge Function exist, storefront browsing works but
sign-in is explicitly unavailable and checkout cannot load.

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
the frontend while both backends accept orders. Publishing never enables live
payments; all orders here remain unfulfilled sandbox tests.