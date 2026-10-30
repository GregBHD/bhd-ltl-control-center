# Integration handoff

## Verified and reused

The Food It Forward reference source was inspected. This project adapts its design vocabulary and official BHD logo. It is a separate application, not a modification of Food It Forward or USPS. No USPS code, authentication, adapter, document backend, tenant model, audit backend, or deployment structure was available to verify. No production endpoint was invented or called.

## Replaceable boundary

DemoAdapter creates the normalized snapshot consumed by the application. `readSnapshot()` exposes `{data, mode, asOf, lastSuccessfulSync}`. SunnybrookAdapter intentionally throws an unconfigured error. The frontend currently uses the synchronous demo seed for its initial snapshot and localStorage only for synthetic mutations.

Production work must add an authenticated server application. Do not substitute live records directly into this static bundle.

The following are proposed normalized fields, NOT verified Sunnybrook field names:

- `customerId`, stable `id` (Sunnybrook load ID), stable origin/destination facility IDs.
- Original pickup/delivery commitments; separately revised ETA and actual timestamps.
- Carrier ID, original carrier status/event payload, normalized milestone, source timestamp, source event ID.
- Child PRO/piece IDs, quantities, statuses, expected pieces, cancellation/correction flags.
- References: BOL, PO/customer reference.
- Pallets, pounds, dimensions and units, class, service, handling, ready time, stackability.
- Customer-only linehaul/fuel/accessorials, expected total, invoiced total and charge basis; optional invoice revision metadata.
- Scoped document metadata and server-authorized download endpoints.

## Inputs still required

1. USPS source access and instructions, reusable modules, service dependencies, and regression suite.
2. Supported Sunnybrook API contract; sandbox credentials held server-side; exact endpoints/field names and tenant access scope.
3. Pagination strategy and stable cursor; update-since semantics; cancellation/correction history; rate limits; webhook support or supported incremental cadence.
4. Explicit customer/facility ID mapping and validated time zones. Never infer authorization from matching names.
5. Carrier source timestamp semantics, timezone offsets, delivery commitment ownership, split-PRO completion rule, missing-data policies.
6. Customer roles, finance permissions, internal-note policy, shared database, document storage, identity provider, deployment environment.

## Production implementation requirements

- Scope server queries by tenant and facility before records, aggregates, search, exports, documents, comments, or direct IDs are returned. Deny by default; verify object ownership on every request.
- Use explicit allowlisted customer DTOs. Never send carrier buy, internal margin, commission, or internal profitability to the customer browser.
- Keep secrets server-side. Private hosting is not a substitute for record-level authorization.
- Ingest pages transactionally; dedupe by stable load/event identifiers; process corrections and cancellations idempotently. Preserve original commitments and raw carrier events.
- Normalize timestamps with explicit source time zones and preserve raw values. Retry transient failures with backoff and a checkpointed cursor; show unavailable/stale mode on failures.
- Label nightly data as a snapshot. Show both last successful sync and each source update. Adopt supported event or incremental refresh within API limits before claiming operational/live freshness.
- Place comments, owners, resolutions, review items, and immutable audit history in a shared tenant-scoped backend keyed by stable Sunnybrook load IDs. Ensure concurrency/version checks. Do not conflate issue resolution and carrier status.
- Implement signed, authorized document delivery. Missing files remain unavailable; distinguish synthetic samples from real documents.
- Resolve a load only after every expected piece/PRO is delivered or an explicitly approved exception policy applies. Avoid double counting totals across child records.
- Validate consolidation against readiness, promised windows, capacity, dimensions, stackability, handling compatibility, current pricing, and service impact. Require review; no automatic booking.
- Writeback is out of scope until a supported API and approved workflow exist. Load creation, booking, dispatch, and payments remain in Sunnybrook.

## Required integration tests before live launch

Cross-tenant and unauthorized facility access through direct load IDs, docs, CSV, search, aggregates, and comments; customer finance field leakage; webhook replay and duplicates; pagination/resume; cancellations/corrections; DST/time-zone edges; split deliveries; document failures; missing commitments/weights; stale source events after a successful sync; shared conversation concurrency; USPS regressions when actual code is reused.

## Mansfield-specific additions (October 30 update)

The directory master contains 11 public entries with stable DEMO identifiers, source URLs, address-quality notes, and explicit unverified receiving status. These must be mapped to an approved customer operating-site master before live records are introduced. Office, PO-box, and mailing entries are not inferred to be delivery endpoints.

The Mansfield workspace adds (a) a standalone continuity scenario calculator, (b) a filtered customer-invoice variance/POD queue derived from synthetic load data, and (c) browser-local receiving-site review annotations. These add no live integration, actual recovered savings, or new operational authority.

For a future fuel/DEF pilot, agree product, gallons, tank/site IDs, working capacity, timestamped usable inventory, consumption assumptions, source quality, safe/approved handling requirements, approved carrier capabilities, delivery evidence, and pricing semantics. FuelNet is the existing Mansfield product identified in official sources; no API endpoint or access entitlement has been verified. Keep general freight and tank-wagon programs distinct. See MAP-SOURCES.md for research and location conflicts.
