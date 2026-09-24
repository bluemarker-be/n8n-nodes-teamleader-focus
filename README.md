# @bluemarker/n8n-nodes-teamleader-focus

n8n community node for the [Teamleader Focus API](https://developer.teamleader.eu/). Covers 48 resources across CRM, invoicing, projects, time tracking, and ticketing — plus a webhook trigger with 15+ event types.

Built to track Teamleader's OpenAPI spec. New endpoints and fields land in successive minor releases. For field-level documentation, refer to the [Teamleader API docs](https://developer.teamleader.eu/).

## Installation

### n8n desktop / cloud

Settings → Community Nodes → **Install a community node** → paste:

```
@bluemarker/n8n-nodes-teamleader-focus
```

### Self-hosted n8n

```bash
npm install @bluemarker/n8n-nodes-teamleader-focus
# or via docker-compose: mount as a package under ~/.n8n/custom
```

Then restart n8n. The **Teamleader Focus** action node and **Teamleader Focus Trigger** webhook node appear in the node palette.

## Setup

### 1. Create a Teamleader OAuth2 app

1. Register a Teamleader integration at the [Teamleader Marketplace](https://marketplace.teamleader.eu/)
2. Set the redirect URL to the one shown in n8n's credential setup
3. Note your `client_id` and `client_secret`

### 2. Add credentials in n8n

1. Add a new credential of type **Teamleader Focus OAuth2 API**
2. Enter the client ID and client secret
3. Click **Connect my account** — completes the OAuth2 flow
4. The credential auto-refreshes tokens as they expire

### 3. Use the node

Drop **Teamleader Focus** in any workflow. Pick a resource → operation → fill in the fields. Custom fields are loaded from your account and appear as dropdowns.

## Resources & operations

| Resource | Operations |
| --- | --- |
| Account | `getProjectsV2Status` |
| Bookkeeping Submission | `getMany` |
| Call | `add` `complete` `delete` `get` `getMany` `update` |
| Closing Day | `add` `delete` `getMany` |
| Cloud Platform | `getUrl` |
| Company | `create` `delete` `get` `getMany` `tag` `untag` `update` `uploadLogo` |
| Contact | `create` `delete` `get` `getMany` `linkToCompany` `tag` `unlinkFromCompany` `untag` `update` `updateCompanyLink` `uploadAvatar` |
| Credit Note | `download` `get` `getMany` `sendViaPeppol` |
| Currency | `getExchangeRates` |
| Custom Field | `create` `get` `getMany` |
| Day Off | `bulkDelete` `createType` `deleteType` `import` `listTypes` `updateType` |
| Deal | `create` `delete` `get` `getMany` `lose` `move` `update` `win` |
| Deal Phase | `create` `delete` `getMany` `move` `update` |
| Deal Pipeline | `create` `delete` `duplicate` `getMany` `markAsDefault` `update` |
| Deal Source | `getMany` |
| Department | `get` `getMany` |
| Email Tracking | `create` `getMany` |
| Event | `cancel` `create` `get` `getMany` `update` |
| Expense | `getMany` |
| External Party | `addToProject` `delete` `update` |
| File | `delete` `download` `get` `getMany` `upload` |
| Incoming Credit Note | `add` `approve` `delete` `get` `listPayments` `markPending` `refuse` `registerPayment` `removePayment` `sendToBookkeeping` `update` `updatePayment` |
| Incoming Invoice | `add` `approve` `delete` `get` `listPayments` `markPending` `refuse` `registerPayment` `removePayment` `sendToBookkeeping` `update` `updatePayment` |
| Invoice | `book` `copy` `credit` `creditPartially` `delete` `download` `draft` `get` `getMany` `registerPayment` `removePayments` `send` `sendViaPeppol` `update` `updateBooked` |
| Level Two Area | `getMany` |
| Mail Template | `getMany` |
| Meeting | `complete` `createReport` `delete` `get` `getMany` `schedule` `update` |
| Note | `create` `delete` `getMany` `update` |
| Order | `get` `getMany` |
| Plannable Item | `get` `getMany` |
| Product | `create` `delete` `get` `getMany` `update` |
| Project | `addCustomer` `addDeal` `addOwner` `addQuotation` `assign` `close` `create` `delete` `duplicate` `get` `getMany` `removeCustomer` `removeDeal` `removeOwner` `removeQuotation` `reopen` `unassign` `update` |
| Project Group | `assign` `create` `delete` `duplicate` `get` `getMany` `unassign` `update` |
| Project Line | `addToGroup` `getMany` `removeFromGroup` |
| Project Material | `assign` `create` `delete` `duplicate` `get` `getMany` `unassign` `update` |
| Project Task | `assign` `create` `delete` `duplicate` `get` `getMany` `unassign` `update` |
| Quotation | `accept` `create` `delete` `download` `get` `getMany` `send` `update` |
| Receipt | `add` `approve` `delete` `get` `listPayments` `markPending` `refuse` `registerPayment` `removePayment` `sendToBookkeeping` `update` `updatePayment` |
| Reservation | `create` `delete` `getMany` `update` |
| Subscription | `create` `deactivate` `get` `getMany` `update` |
| Task | `complete` `create` `delete` `get` `getMany` `reopen` `schedule` `update` |
| Team | `getMany` |
| Ticket | `addInternalMessage` `addReply` `create` `get` `getMany` `getMessage` `importMessage` `listMessages` `update` |
| Time Tracking | `add` `delete` `get` `getMany` `resume` `update` |
| Timer | `getCurrent` `start` `stop` `update` |
| User | `get` `getCurrent` `getMany` `getWeekSchedule` `listDaysOff` `listSchedules` |
| User Availability | `getDaily` `getTotal` |
| Webhook | `getMany` `register` `unregister` |

## Webhook trigger

The **Teamleader Focus Trigger** node subscribes to Teamleader webhook events without manual configuration in the Teamleader dashboard — it auto-registers on activation and unregisters on deletion.

Supported events include:

- **Deal** — created, updated, phase moved, won, lost, deleted
- **Contact / Company** — created, updated, deleted, tagged
- **Invoice** — drafted, booked, sent, paid, credited, Peppol submission succeeded/failed
- **Credit note** — created, booked, sent, Peppol submission succeeded/failed
- **Project** — created, updated, closed, reopened
- **Meeting / Task** — created, updated, completed

Configure the events you want to receive in the trigger node — the node handles subscription lifecycle and returns the raw event payload as workflow input.

## Automatic behaviors

- **Pagination**: `Get Many` operations expose a **Return All** toggle. When enabled, all pages are fetched automatically (page size clamped to the API max of 100). When disabled, use **Limit** to cap results.
- **Custom fields**: for resources that support custom fields (Contact, Company, Deal, Invoice, Meeting, etc.), the node loads your account's field definitions and shows them as pickers. Values are sent in the API's `custom_fields: [{id, value}]` shape.
- **Date formatting**: n8n's dateTime picker outputs ISO 8601. The node automatically converts date-only fields (`invoice_date`, `starts_on`, etc.) to `YYYY-MM-DD` and timestamp fields (`started_at`, `due_at`, etc.) to the `+00:00`-offset format the Teamleader API expects.
- **Rate limiting**: Teamleader allows 200 requests/minute (sliding window). The node handles `429` responses by reading the `x-ratelimit-reset` header and waiting until the oldest request expires, up to 3 retries.
- **Token refresh**: expired OAuth2 access tokens are refreshed automatically via the credential; the node also retries once on `401` responses to handle single-use refresh-token race conditions.
- **Includes**: resources that return richer data via `includes=` (custom fields, related entities, price lists, etc.) have the relevant includes applied automatically. No configuration required.

## Spec alignment

Field names, enum values, and request shapes are aligned to the [Teamleader Focus OpenAPI spec](https://developer.teamleader.eu/). New Teamleader releases are audited against the node — see [CHANGELOG.md](./CHANGELOG.md) for the exact spec version each release targets.

Known divergences and legacy behavior (e.g. Meeting `Custom Location` auto-migrating to `type: address`, Expense `payment_statuses` enum fix) are documented per release.

## Development

```bash
git clone https://github.com/bluemarker-be/n8n-nodes-teamleader-focus
cd n8n-nodes-teamleader-focus
npm install
npm run dev     # hot-reloads into local n8n
npm run build   # produces dist/
npm run lint    # eslint via @n8n/node-cli
```

## License

MIT © [Henk de Blauw / Blue Marker](https://www.bluemarker.be)
