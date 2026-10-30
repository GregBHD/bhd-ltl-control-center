# Mansfield map and research provenance

Reviewed October 30, 2026. The search connector was unavailable; official public pages were fetched directly over HTTPS and inspected. No private Mansfield data was accessed.

## Public location directory

Source: https://mansfield.energy/locations/

The detailed directory contains 11 entries. These are not a verified operating-site or receiving-dock master. No claim is made that every Mansfield physical facility is represented.

| ID | Directory label | Published address | Treatment |
|---|---|---|---|
| GNV | Headquarters / Mansfield Oil Company | 1025 Airport Parkway SW, Gainesville, GA 30501 | Published headquarters address; receiving unverified |
| HSP | MSP – Houston | 223 McCarty Street, Houston, TX 77029 | Separate from Houston Gessner office |
| LOR | Loretto | 260 St. John St, Loretto, MN 55357 | Detailed text retained; summary and its map link still say Roseville |
| DOR | MPG – Doraville | 2765 Woodwin Rd., Doraville, GA 30305-2980 | Published ZIP differs from linked map; flag for validation |
| DEN | Denver | 1401 17th St, Suite 500, Denver, CO 80202 | Published office address |
| SID | MSP – Sidney | 429 S. Vandemark Rd, Sidney, OH 45365 | Summary says Troy; map link points to Loretto, MN; approximate Sidney city pin |
| BTR | Baton Rouge | 7943 W Pecue LN, Suite B, Baton Rouge, LA | No ZIP in detailed listing |
| RED | Redlands | 25884 Business Center Drive, Suite K, Redlands, CA 92374 | Published office address |
| HOU | Houston | 820 Gessner Road, Suite 675, Houston, TX 77024 | Map link is malformed and refers to another suite; building-level position |
| MRK | Mark | PO Box 48, Mark, IL 61340 | Town-level mailing pin, not a dock |
| YYC | Calgary / Mansfield of Canada | 612-500 Country Hills Blvd, Suite 121, Calgary, AB T3K 5K3 | Linked map resolves to a UPS Store; city-level mailing/contact pin |

Source map links were followed read-only to examine their redirect destinations. Loretto's address coordinates appeared under the mismatched Sidney link. Conflicting entries remain flagged; the directory's textual detailed labels control display names. Troy and Roseville were not added as extra distinct facilities because the public page does not establish whether these are separate active locations or stale summary labels.

All receiving hours and operational contact responsibilities remain unconfirmed. Public phone numbers are shown as office numbers, not dedicated dispatch or receiving contacts. Local review forms create planning annotations only and do not overwrite provenance or independently verify readiness.

## Geography

Local static vector paths are compiled from:

- us-atlas 3.0.1 states-10m.json: https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/states-10m.json — Census-derived boundaries.
- world-atlas 2.0.2 countries-110m.json: https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json — Natural Earth country geometry.

A conic equal-area projection places city/address coordinates consistently with state boundaries. Contiguous US states plus DC are shown, with Canada and Mexico as geographic context. Only the public directory metadata is factual; routes, events, freight, customer charges, and generic external/terminal locations are synthetic.

Compile using Python standard library:

```
python scripts/build-map.py /absolute/path/states-10m.json /absolute/path/countries-110m.json
```

The script reads location coordinates from dist/locations.js and emits dist/map-geography.js. Runtime has no map API key or third-party tile dependency. Pan, bounded zoom, fit-network, wider geography, selectable labels, location list, and active/historical flow layers are available. This is network geography, not navigation or real-time GPS.

## Mansfield-specific value research

1. Fuel Data Management: https://mansfield.energy/solutions/data-management/
   FuelNet already addresses inventory/critical-fill visibility, invoice/document management, and cross-supplier transaction analysis. Recommendation: complement FuelNet with freight execution rather than claim to replace it.
2. LTL fuel: https://mansfield.energy/logistics/ltl-fuel/
   Mansfield's LTL includes tank-wagon fuel service. This demo's palletized LTL shipment model must not be mistaken for an integrated tank-wagon program.
3. Emergency response: https://mansfield.energy/solutions/emergency-response-fuel/
   Supply continuity is a stated priority. The added scenario planner compares modeled time to a planning reserve with inbound ETA; it is not live inventory monitoring.
4. DEF: https://mansfield.energy/supply/diesel-exhaust-fluid/
   Demand, storage, logistics costs, and run-out prevention support a future agreed site/inventory integration. No advertised savings percentage is reused as a BHD forecast.
5. DeliveryONE: https://mansfield.energy/logistics/deliveryone-network/
   Product and delivery types span fuel, DEF, mobile fueling, and other services. Avoid a one-size-fits-all palletized load model for an operational pilot.
6. Fuel Systems & Services: https://mansfield.energy/solutions/fuel-systems-services/
   Product, volume, time, equipment, and site details matter for a future fuel-specific contract. No live endpoint, data access, or compliance guarantee is asserted.

Public marketing pages disagree on network-size figures, so no partner/carrier totals are used as verified scale claims in the app.
