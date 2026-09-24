# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
