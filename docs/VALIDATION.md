# Validation — October 30, 2026

## Automated model checks

Thirteen Node tests passed for the Mansfield update (the nine original business invariants plus four location/scenario checks):

1. 176 unique stable load IDs, 11 facilities, positive freight quantities, consistent child PRO quantities, no observed carrier events after source update or demo as-of.
2. Every facility's active/pickup/delivery KPIs reconcile to supporting filtered unique records; delivered denominator reconciles.
3. Every directional lane reconciles to its supporting records; inbound selection respects destination.
4. Searching second split PRO returns one active partial load, excluded from fully delivered service sample.
5. Resolution requires a reason, appends audit history, and does not change the shipment.
6. Spend uses invoiced OR expected once, cancels excluded, delivered sample and on-time denominator correct, ETA does not replace commitment.
7. Facility view illustration limits records and CSV omits finance fields; confidential profitability fields do not exist.
8. Assigning a stale-tracking exception does not refresh the carrier timestamp or change Unknown status.
9. Consolidation candidate has three consistent ready-date/lane loads totaling nine pallets and 6,300 lb.

## Original browser QA

Desktop preview visually inspected against reference design values. Mobile at 390px and tablet at 768px rendered in same-origin preview frames; found and fixed an offscreen table-label overflow. Verified document width matches viewport (375/375 and 753/753, excluding scrollbars).

Manually exercised Indianapolis filter → 25 active KPI → 25 unique supporting loads; second-PRO search/detail; exception owner/note/resolution and unchanged Scheduled carrier status; stale Unknown shipment and old source date; unavailable POD; consolidation assumptions/three supporting loads and local review creation; customer spend chart and carrier service denominators. Also verified active lane drilldown (5 records), named saved view persistence, actual CSV download with matching row count, facility-role record and finance-field restriction, empty search results, Reset demo, keyboard focus wrapping and Escape close, and mobile shipment navigation. Demo mutations were reset after QA.

No application errors observed during the tested paths. Browser extension metadata warnings are unrelated to application code.

## Mansfield update QA

Re-tested all 13 checks with `npm test`. Source labels and eleven distinct public-directory entries are tested, including the two separate Houston entries, Calgary, missing receiving verification, and known mailing/map-link discrepancies. Every shipment endpoint resolves to a projected point. All 49 contiguous-state/DC paths and Canada/Mexico context are included. Scenario tests cover the reserve buffer, actual empty threshold, capacity conflict, and invalid input rejection.

Desktop browser QA verified all 11 location labels, zoom/fit, drag panning (observed a changed pin transform), active-lane list drilldown to five supporting loads, source notes, sample scenario (40 hours to reserve, 44-hour ETA, −4-hour buffer), and an edited 24-hour ETA producing a 16-hour buffer. Created and then reset a local receiving review. Reset now also clears calculator assumptions. Invoice/POD queue is derived from selected synthetic loads.

Phone and tablet layouts were inspected at 390px/768px frame sizes. Document width equaled available viewport width (375/375 and 753/753 after scrollbars). Phone directory is the default location view; optional map shows the whole extent. Phone calculator interaction returned the same −4-hour sample result without document overflow. Preview screenshots are saved in this repository. No app-origin console errors were observed; browser extension metadata warnings were excluded.

## Limits

This validates a browser-local synthetic demonstration. It does not test a live Sunnybrook API, real documents, production authentication/authorization, backend persistence/concurrency, or USPS regressions because those integrations and source components were unavailable. No production security claims are made. Browser-first loading/error notices exist; network fault injection and a full accessibility audit were not performed.
