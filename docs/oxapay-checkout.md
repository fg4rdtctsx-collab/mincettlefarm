# OxaPay checkout — sandbox only

This integration never requests live invoices. It uses `sandbox: true` and is available only in development with the merchant key, session secret and Replit development HTTPS domain. The current public URL is used for sandbox callbacks and return links only, not treated as a published URL. No payouts or refunds are automated.

## Merchant confirmation before live activation

- Confirm the explicitly authorized owner account. Set `OWNER_CLERK_USER_IDS` through the workspace environment-variable tooling to its Clerk user ID(s). Never authorize the first signup automatically. The owner page displays an unauthorized signed-in account's ID for confirmation.
- Confirm final USD prices, authoritative quantities, shared-family inventory policy and fulfillment details. Browser-only admin drafts are not a live catalog.
- Confirm merchant-selected coins, networks, fee payer, underpayment policy and settlement settings. The integration does not change these settings.
- Customer-facing checkout may explain that bank transfers can take longer to confirm during busy periods and that confirmed crypto orders receive priority dispatch to help with faster delivery. Do not promise instant confirmation or a delivery date; sandbox invoices never trigger fulfillment.
- Obtain the actual published HTTPS URL using deployment tooling; configure and verify publicly reachable callbacks, including provider retries.
- Obtain explicit approval, then implement/review live-mode configuration and separate live inventory. Merely adding a key or publishing cannot activate payments.

## Persistence and reservations

The sandbox catalog is seeded once from the storefront's published JSON prices. Every currently in-stock product receives **10 artificial test units**, not a representation of real cattle quantities. It is independent of any Diego Farm stock system.

Creating an order locks inventory rows in product-ID order, deducts quantities and stores immutable order lines, trusted cents totals and buyer contact details. A database advisory lock and unique request ID protect concurrent retries, including across server processes. Identical request IDs return the same order; changed request data with the same ID is rejected. Customer access uses a secret-derived 256-bit token, checked against a persisted hash, with the return token in a URL fragment.

Paid commits the reservation and is irreversible. OxaPay-confirmed expired or failed invoices release once. Paying remains unconfirmed. Late paid after release goes to manual review. An ambiguous invoice timeout keeps the reservation and a review receipt; it never creates a second invoice automatically. A verified callback can adopt the invoice reference when it arrives before the creation response or after a timeout. If no callback arrives and no reference is known, owner reconciliation against OxaPay is required; do not release or retry blindly.

An invoice reference is reconciled on private receipt reads, rate-limited in the database. A small background batch also checks abandoned invoices every 30 seconds, so confirmed expiry can release inventory without a customer returning. Interrupted creation without an invoice reference becomes review after a minute, with its reservation retained. OxaPay outages do not mark orders paid or expired. Callback bodies are verified using HMAC-SHA512 over exact raw bytes, with constant-time comparison; payment-information supplies trusted order, invoice, amount, currency and state. Callback coin currencies are not assumed to be the invoice's USD currency. A Paid callback whose authoritative lookup still shows pending receives a retryable error instead of a premature acknowledgement. Only durable processing receives HTTP 200 `ok`.

## Verification

Run `pnpm --filter @workspace/api-server run test:checkout` against development only. Tests use synthetic OxaPay responses and remove only their own order/reservation records. They cover duplicate concurrent creation, authoritative prices, private access, HMAC bytes, association/amount/currency mismatches, paying/paid, repeated/out-of-order updates, expiration/failure release, late payments and ambiguous/rejected creation. Hosted sandbox invoice creation and browser/auth checks should also be verified before enabling live mode.