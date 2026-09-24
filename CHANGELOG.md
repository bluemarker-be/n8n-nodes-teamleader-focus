# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.12] - 2026-09-24

_Session 6 continuation — remaining spec-review gaps addressed after final verification._

### Added

- **Project — Create**: new `Customers` and `Assignees` fixedCollections (API allows setting these at creation time — was only possible via post-create `addCustomer`/`assign` calls). Each entry accepts `type` (contact/company or user/team) + `id`. Handler builds arrays of `{type, id}`.
- **Project Group — Create**: new `Assignees` fixedCollection (same shape as Project). Users/teams can now be assigned during creation instead of only via post-create `assign` call.
- **Project Material — Update**: 4 new fields per spec:
  - `Billing Method` (enum: unit_price/fixed_price/parent_fixed_price/non_billable)
  - `Quantity Estimated` (number)
  - `Unit Cost Amount` + `Unit Cost Currency` (transformed to `{amount, currency}` Money object via handler)
  - `Unit ID` (string, unit of measure ID)
- **Credit Note — Download format**: added `UBL (Peppol BIS 3)` and `UBL (XRechnung)` per spec's full enum (was only pdf + ubl/e-fff)
- **Invoice — Download format**: added `UBL (XRechnung)` per spec

### Fixed

- **Project Material — Create `groupId`**: handler now correctly handles the field as optional (matches 0.2.11 UI change). Empty groupId is omitted from the request body instead of sending an empty string.

### Verified as non-bugs (agents were wrong)

- Meeting `createReport` — handler correctly nests `attachToType`/`attachToId` into `attach_to: {type, id}` at runtime.
- TimeTracking `add` — subject.type enum already matches spec exactly (`[company, contact, event, milestone, nextgenTask, ticket, todo]`).
- Reservation `create`/`update` — duration builds `{value, unit: 'minutes'}` and assignee builds `{type, id}` per spec.

### Known remaining gaps (won't fix this release)

- Invoice `creditPartially` — spec allows optional `credit_note_date` + `discounts` (not needed for typical partial credits, low priority)
- Product `create` — spec allows `code` as alternative to `name` for required identification (UX enhancement, not a bug)

## [0.2.11] - 2026-09-24

_Full-codebase spec-review round — 6 parallel agents against 48 resources, 10 confirmed bugs fixed after manual verification._

### Fixed

- **Project Task — Create `billing_method` enum**: was `[time_and_materials, fixed_price, non_billable]` (all invalid for project tasks — `time_and_materials` is a Project-level value). Spec accepts `[user_rate, work_type_rate, custom_rate, fixed_price, parent_fixed_price, non_billable]`. Enum fully replaced; default changed to `user_rate`.
- **Project Material — Create `billing_method` default**: default was still `time_and_materials` even after the 0.2.10 enum fix. Corrected to `unit_price` (first valid enum value).
- **Project Material — Create `groupId`**: field was required but spec says optional ("If omitted, the material is not added to a group"). Removed `required: true`.
- **Note — Create `subject.type` enum**: was `[company, contact, deal, meeting, project, ticket]` — `ticket` and `project` are NOT valid (spec has `nextgenProject`, no `ticket`). Corrected to spec enum `[company, contact, creditNote, deal, invoice, meeting, nextgenProject, product, quotation, subscription]`.
- **Note — List `subject_type` filter**: same fix as create — filter enum now matches spec.
- **Invoice — Send `from` field**: removed. Field was in the UI as required, but not in the API spec at all. API silently ignored it — users setting a "From Email" thought they were setting a sender but nothing happened. Removed to avoid confusion.
- **Quotation — Create/Update `expiry` field name**: node built `expiry: {date, action_after_expiry}` but spec expects `expiry: {expires_after, action_after_expiry}`. Field name corrected. Expiry setting now actually persists.

### Added

- **Invoice — Send `Mail Template`**: new field (loadOptions from `getMailTemplates`) matching spec's `content.mail_template_id`. Sets the email language and tracks which template was used.
- **Invoice — Send `Attachments`**: new field accepting a JSON array of file IDs matching spec's `attachments`. Aligns with the quotation.send capability.

### Review methodology & notes

- Six parallel Explore agents each covered 4-8 resources against spec 1.220. Each finding was manually verified against the raw spec YAML before acting (~40% of agent claims were hallucinations or misreads and were skipped).
- **Batch findings summary**:
  - Batch 1 (Deal): 0 bugs — clean
  - Batch 2 (Invoice/CreditNote/Quotation): 3 confirmed fixes (from-field, mail-template, expiry, attachments)
  - Batch 3 (Projects family): 3 confirmed fixes (ProjectTask billing, ProjectMaterial default+groupId)
  - Batch 4 (Meeting/Event/Task/TimeTracking/Reservation): most flagged items were false alarms after verification (handler nesting was correct); need deeper look at Meeting.createReport, Reservation duration/assignee, TimeTracking add subject enum in a next round
  - Batch 5 (Financial support): payment ops all correctly implemented
  - Batch 6 (Contacts/Companies/Tickets/misc): 1 confirmed fix (Note subject enum)
- Known remaining gaps flagged but NOT fixed this release (need further review): Project.create missing `customers`/`assignees` arrays; ProjectGroup.create missing `assignees`; ProjectMaterial.update missing `unit_cost`/`quantity_estimated`/`billing_method`/`unit_id`; CreditNote.download missing `ubl/peppol_bis_3` format; Invoice.creditPartially missing optional `credit_note_date`/`discounts` fields.

## [0.2.10] - 2026-09-24

_Deep spec-review hotfix — random-sample review of 6 resources uncovered 5 pre-existing shape/enum bugs._

### Fixed

- **Task — `estimated_duration`**: API only accepts `unit: 'min'` per spec (`DurationInMinutes` type). Node previously sent `unit: 'hours'` or `unit: 'minutes'` which the API rejected. Handler now auto-converts: hours → minutes (× 60), and always sends `unit: 'min'`. UI still shows Hours/Minutes for user friendliness. Default UI unit changed from Hours to Minutes to match the natural API contract.
- **Meeting — `work_type_id` removed**: field was in the UI on both `schedule` and `update`, but the spec has no `work_type_id` on meetings (0 occurrences in `/meetings.schedule` and `/meetings.update` sections). The API silently ignored it. Removed from UI so users don't waste time filling in a field that never worked.
- **Incoming Invoice — `total.tax_exclusive` / `total.tax_inclusive` shape**: spec expects `{amount: number}` objects (per `Money` type), node was sending flat numbers. Any request with these fields would return HTTP 400. Fixed on both `add` and `update`.
- **Incoming Credit Note — `total.tax_exclusive` / `total.tax_inclusive` shape**: same bug as Incoming Invoice. Fixed on both `add` and `update`.
- **Event — `links[].type` enum**: node exposed `[contact, company, deal, project, ticket, milestone]` but spec accepts only `[contact, company, deal]`. Removed the 3 invalid options from both `create` and `update` link pickers. Users picking `project`/`ticket`/`milestone` were sending silently-ignored data.

### Notes

- Review methodology: 6 resources sampled (Meeting, Task, IncomingInvoice, Product, Event, Deal). Hit rate ≈ 100% — every deep-reviewed resource had at least one shape or enum bug. Suggests broader codebase has more latent issues; further reviews recommended for high-traffic resources.
- Known gap (not fixed): **Product `price_list_prices`** — spec under-documents the item shape (`type: array, items: {}`); skip until Teamleader clarifies. Product `stock` / `configuration.stock_threshold` are feature-gated and out of common scope.

## [0.2.9] - 2026-09-24

_Session 4 — the "rest bucket": field additions across 10+ resources, plus a new Deal Source resource and Peppol webhook events._

### Added

- **Deal Source — new resource** (API Aug 2026): `Get Many` operation with `term` filter (searches source name)
- **Webhook Trigger — 4 new Peppol events** (API Jan 2026): `invoice.peppolSubmissionSucceeded`, `invoice.peppolSubmissionFailed`, `creditNote.peppolSubmissionSucceeded`, `creditNote.peppolSubmissionFailed`. Added to both the Trigger node's event picker and the Webhook (register/unregister) resource's event enum.
- **Day Off — Import**: new `Date (Full Day)` field per day item (API Aug 2026), alternative to `Starts At` + `Ends At`. When set, the entry is stored as a full day off; the handler prefers `date` over the range when both are provided.
- **Project — Update**: 5 initial-baseline fields for imported projects (API May 2026)
  - `initial_time_tracked` (value + unit: hours/minutes/seconds), transformed to `{value, unit}`
  - `initial_price` (amount + currency), transformed to Money `{amount, currency}`
  - `initial_cost` (amount + currency), same
  - `initial_amount_billed` (amount + currency), same
  - `initial_amount_paid` (amount + currency), same
- **Project Material — Create**: `Parent Fixed Price` as new billing method (API Apr 2026)

### Fixed

- **Project Material — Billing Method**: enum values corrected to match API spec. Was `[time_and_materials, fixed_price, non_billable]` (invalid — `time_and_materials` is a Project-level value, materials use `unit_price`). Now: `[unit_price, fixed_price, parent_fixed_price, non_billable]`. Existing workflows using `time_and_materials` on materials were already rejected by the API — no functional regression.
- **Reservation — Get Many filters** (API May 2026): `project_ids` (comma-sep), `work_type_ids` (comma-sep), `term`
- **Ticket — Create / Update**: `project_id` field for linking to nextgen projects (mutually exclusive with legacy `milestone_id`) (API Jun 2026)
- **Ticket — Get Many filter** (API Aug 2026): `assignee_ids` (multi-select users). Includes note on using `null` via expression to match unassigned tickets
- **Contact — Create / Update**: `price_list_id` field with price-list picker (API Jul 2026). On Update, leaving empty sends `null` to unlink
- **Contact — Get Many filter**: `company_id` description clarifies that null (via expression) matches contacts linked to no company at all (API Aug 2026)
- **Company — Create / Update**: `price_list_id` field with price-list picker (API Jul 2026)
- **Time Tracking — Get Many filter**: `relates_to` (type + id), with new API values `nextgenProject` and `nextgenProjectGroup` alongside legacy `milestone` and `project` (API Feb 2026)
- **Note — Delete** operation (API Jun 2026) — was previously missing despite the API supporting it

### Changed

- `handleGetMany`: `work_type_ids` now auto-splits from comma-separated string to array (same treatment as `plannable_item_ids`, `types`)
- `nestMoneyFields`: extended to include the 4 initial-price Money fields for projects

## [0.2.8] - 2026-09-24

_Documentation release — README overhaul._

### Changed

- **README**: rewritten to match the style of `@bluemarker/teamleader-focus-js-sdk`. Adds full resource-and-operations table (47 resources), setup walkthrough, automatic-behaviors documentation (pagination, custom fields, date formatting, rate limiting, includes), spec-alignment note, and development commands.

## [0.2.7] - 2026-09-24

_Session 3 — Deals + Subscriptions + Invoices expansion._

### Added

- **Deal — Create / Update**:
  - `purchase_order_number` field (API May 2026)
  - `second_responsible_user_id` field with user picker (API Sep 2026) — requires the "second deal responsible" feature to be enabled by Teamleader support
- **Deal — Get / Get Many**: `second_responsible_user` added to `includes=` — the field is returned in the response when the feature is enabled. If your account does not have this feature, this include may be silently ignored or (potentially) reject the request; open an issue if you hit errors.
- **Subscription — Create / Update**:
  - `purchase_order_number` field (API Mar 2026)
  - `delivery_information_days` field, transformed into `delivery_information: { type: 'set_days_after_invoice_date', number_of_days_after_invoice_date }` (same pattern as invoices) (API Mar 2026)
  - `invoice_content` field (goods / services / goods_and_services) (API Sep 2026)
- **Invoice — Draft / Update / Update Booked**: `invoice_content` field (API Sep 2026)

### Changed

- **Deal — Estimated Value Amount**: description now notes that negative values are allowed (e.g. when the deal is linked to a negative quotation) (API Aug 2026 — no code change was needed since the UI never enforced `minValue: 0`)

### Notes

- The `subscription` field on `invoices.list` response and the `purchase_order_number` / `delivery_information` response fields on subscriptions are picked up automatically via raw API-response passthrough (no code change).

## [0.2.6] - 2026-09-24

_Session 2 — new operations and location-type migration._

### Added

- **Call — Delete** operation (API May 2026)
- **User — List Schedules** operation (`userSchedules.list`, API Jun 2026): batch working-schedule query for multiple users over a date range of up to 7 days. Replaces the single-user Get Week Schedule.
- **Deal Pipeline — filters** on Get Many: `ids`, `statuses` (open, pending_deletion), `term` (searches pipeline name) (API Aug 2026)
- **Meeting — Location type "Address"** (API Apr 2026): new preferred inline-address type. The legacy `Custom Location` type is kept in the UI as `Custom Location (Legacy)` and auto-migrates to `type: address` in the API request, so existing workflows keep working without changes.

### Changed

- **User — Get Week Schedule** relabeled to `Get Week Schedule (Deprecated)` — Teamleader deprecated this in favor of the new List Schedules operation. Existing workflows continue to work.

### Notes

- **Meeting — `online_meeting_room` → `customer_meeting_room` response rename** (API Apr 2026) — no code change needed; node passes raw API responses through, so the rename is picked up automatically.

## [0.2.5] - 2026-09-24

_Spec-conformance hotfix — three pre-existing enum/handler gaps surfaced during the 0.2.4 spec review._

### Fixed

- **File — subject types** now match the API spec exactly:
  - Added missing types: `invoice`, `creditNote`, `nextgenProject`
  - Removed `project` (never valid per API spec, legacy leftover)
  - Full accepted enum: `company, contact, creditNote, deal, invoice, nextgenProject, ticket, temporary`
- **File — Upload with `temporary`** subject type: handler now omits `subject.id` per spec (spec: "Not required if type is temporary"). Subject ID field is hidden in the UI when Temporary is selected.
- **Expense — sort field**: removed `created_at` (never valid per API spec). Only `document_date`, `due_date`, `supplier_name` accepted.

### Changed

- **Quotation — Name** field description now documents the API constraints (1-80 chars, rejected characters, auto-generation fallback on create)

## [0.2.4] - 2026-09-24

_Session 1 of the 2026 API-changelog coverage sweep — quick wins & small fields (based on API spec v1.220)._

### Added

- **File — Upload**: new `temporary` subject type for uploading files not linked to any subject (API Jan 2026)
- **Quotation — Create / Update**: `name` field (API Aug 2026)
- **Expense — List filters**:
  - `supplier` filter (type + ID pair, nested to `supplier: {type, id}` for the API) (API Feb 2026)
  - `paid_at` filter with operator (`equals`, `before`, `after`, `between`, `is_empty`) and value/start/end fields (API Feb 2026)
- **Expense — Sort**: added `due_date` and `supplier_name` as sort field options (API Feb 2026)

### Fixed

- **Expense — payment_statuses filter**: enum values were `[paid, unpaid]` (invalid); corrected to `[unknown, paid, partially_paid, credited, not_paid]` per API spec. Existing workflows using `paid` still work; `unpaid` needs to be migrated to `not_paid`.

### Metadata

- Fixed `author.website` → `author.url` in package.json (npm's Person spec uses `url`; `website` was silently ignored)

## [0.2.3] - 2026-04-12

_First public release under the `@bluemarker` scope, published 2026-09-24. Repository moved to `github.com/bluemarker-be/n8n-nodes-teamleader-focus`._

### Added

- Meeting: `project_id` and `group_id` fields for linking meetings to projects and groups (schedule + update)
- Invoice: `delivery_information` field for specifying delivery days after invoice date (draft + update booked)

### Changed

- API spec updated to v1.136.0
- Meeting: `location` field refactored from plain string to structured object supporting 5 location types (Virtual, Contact, Company, Custom Location, Calendar Resource) with proper address fields

### Removed

- Meeting: `milestone_id` field (deprecated — linked to legacy projects being phased out)

## [0.2.2] - 2026-03-17

### Fixed

- Webhook trigger crash "Cannot read properties of undefined (reading 'data')" caused by API returning 204 No Content on register/unregister
- Webhook unregister sent `{ id }` but Teamleader API requires `{ url, types }`
- Webhook register tried to read non-existent `id` from empty 204 response
- Webhook lifecycle now correctly stores and uses `url` + `types` as identifier (Teamleader has no webhook IDs)
- Changed event types are now detected and re-registered automatically

## [0.2.1] - 2026-03-16

### Fixed

- Email filter for contacts/companies list: now sends as `{ type: "primary", email: "..." }` instead of flat string, fixing "type must be present" API error
- Default page size for all Get Many operations changed from 20 to 100 (API maximum), reducing number of API calls

## [0.2.0] - 2026-03-08

### Added

- Task list: `deal_id` filter (undocumented API filter to find tasks linked to a specific deal)

### Changed

- API spec updated to v1.119.0
- `filter.status` now sends as array (multiOptions) for deals, invoices, and subscriptions — matches API spec
- Default page size increased from 20 to 100 for better performance
- Subscription update: `project_id` and `deal_id` are now nullable (send empty to unlink)

### Fixed

- Timestamp formatting: fields like `started_at`, `ends_at`, `updated_since`, `paid_at` etc. now send as `+00:00` instead of `Z` to match Teamleader API requirements
- Added missing date-only fields `from` and `until` (used in `date_validity` for dayOffTypes)

## [0.1.0] - 2026-02-01

### Added

- Initial project setup with API specification (v1.107.0) from Teamleader Focus
- Programmatic node with 42 resources, ~220 operations covering 201 API endpoints
- Trigger node with ~55 webhook event types
- OAuth2 authentication with body-based token exchange
- ~30 loadOptions methods for dynamic dropdowns (users, work types, pipelines, price lists, etc.)
- Custom fields support via fixedCollection with partial update strategy
- API spec updated to v1.115.0

### Changed

- Replaced 27 JSON input fields with structured UI fields (dropdowns, fixedCollections, multiOptions) for better usability:
  - Subscription: billingCycle, paymentTerm, invoiceGeneration → structured fields
  - Meeting/Event: attendees → fixedCollection with type + id
  - Event: links → fixedCollection with type + id
  - ProjectTask/ProjectMaterial: assignees → fixedCollection with type + id
  - Project: owner_ids → multiOptions with user dropdown
  - Quotation/Invoice: discounts → fixedCollection with value + description
  - Quotation/Invoice: expiry → date + action dropdown
  - Invoice: expected_payment_method → method dropdown + reference
  - Quotation send: from → sender type + id + email fields; cc/bcc → fixedCollection
  - DayOff: days → fixedCollection with starts_at + ends_at
- Time Tracking: added support for all API variants via mode selector:
  - Add: "Start Time & Duration", "Start & End Time", "Date & Duration"
  - Update: "Start Time" or "Date Only"
- Fixed subject type enums for Time Tracking to match API spec (removed deal, project where not supported)
- Made spec-required fields (dealPipeline name, dealPhase name/attention, timeTracking duration) always required in UI
- Improved descriptions with JSON examples for remaining complex fields (grouped_lines, recipientsTo, etc.)
- Validator: added oneOf field handling for conditional required fields
