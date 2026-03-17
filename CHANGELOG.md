# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
