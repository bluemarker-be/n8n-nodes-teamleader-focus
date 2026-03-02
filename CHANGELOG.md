# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
