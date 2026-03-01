# Teamleader Focus n8n Node — Full API Spec Audit

Vergelijking van ELKE resource+operation in de n8n node tegen de YAML spec (`api-specs/1.115.0.yaml`).

**Legenda:**
- OK = implementatie matcht de spec
- ISSUE = afwijking gevonden (met severity)

---

## 1. CONTACT

| Endpoint | Verdict |
|---|---|
| contacts.add | OK |
| contacts.delete | OK |
| contacts.info | OK |
| contacts.list | OK |
| contacts.linkToCompany | OK |
| contacts.unlinkFromCompany | OK |
| contacts.tag | OK |
| contacts.untag | OK |
| contacts.update | OK |
| contacts.updateCompanyLink | OK |
| contacts.uploadAvatar | OK |

---

## 2. COMPANY

| Endpoint | Verdict |
|---|---|
| companies.add | OK |
| companies.delete | OK |
| companies.info | OK |
| companies.list | OK |
| companies.tag | OK |
| companies.untag | OK |
| companies.update | OK |
| companies.uploadLogo | OK |

---

## 3. CUSTOM FIELD

| Endpoint | Verdict | Details |
|---|---|---|
| customFieldDefinitions.create | OK | |
| customFieldDefinitions.info | OK | |
| customFieldDefinitions.list | LOW | Ontbreekt `ids` filter en `sort` opties |

---

## 4. DEAL

| Endpoint | Verdict | Details |
|---|---|---|
| deals.create | OK | `lead` wrapper, `estimated_value` nesting, `currency` nesting, `contact_person_id` — alles correct |
| deals.delete | OK | |
| deals.info | OK | |
| deals.list | LOW | Ontbreekt `ids`, `customer` (genest object), `estimated_closing_date` filters |
| deals.lose | OK | |
| deals.move | OK | |
| deals.update | OK | Zelfde nesting als create |
| deals.win | OK | |

---

## 5. DEAL PIPELINE

| Endpoint | Verdict | Details |
|---|---|---|
| dealPipelines.create | OK | |
| dealPipelines.delete | MEDIUM | Ontbreekt `migrate_phases` array parameter (om deals te migreren voor deletion) |
| dealPipelines.duplicate | OK | |
| dealPipelines.list | OK | |
| dealPipelines.markAsDefault | OK | |
| dealPipelines.update | LOW | Spec zegt `name` is required, n8n heeft het in optionele updateFields |

---

## 6. DEAL PHASE

| Endpoint | Verdict | Details |
|---|---|---|
| dealPhases.create | **HIGH** | Ontbreekt verplicht veld `requires_attention_after` (moet `{amount, unit}` zijn). Stuurt ook `pipeline_id` i.p.v. spec's `deal_pipeline_id`. Ontbreekt `follow_up_actions`. |
| dealPhases.delete | OK | |
| dealPhases.duplicate | N/A | Bewust weggelaten (bestaat niet in werkelijkheid) |
| dealPhases.list | MEDIUM | Stuurt `pipeline_id` als top-level param i.p.v. `filter.deal_pipeline_id`. Ontbreekt `ids` filter. |
| dealPhases.move | **HIGH** | Stuurt `position` (getal) i.p.v. spec's `after_phase_id` (UUID). Compleet verkeerde parameter. |
| dealPhases.update | **HIGH** | Stuurt plat `requires_attention_after_days` (getal) i.p.v. genest `requires_attention_after: {amount, unit}`. Ontbreekt `follow_up_actions`. |

---

## 7. INVOICE

| Endpoint | Verdict | Details |
|---|---|---|
| invoices.draft | MEDIUM | (1) `currency` in additionalFields wordt plat verzonden, niet als `{code, exchange_rate}`. (2) Veld heet `discount` (enkelvoud) maar spec verwacht `discounts` (meervoud, array). (3) Geen `custom_fields` support. |
| invoices.update | MEDIUM | (1) `payment_term_type` en `payment_term_days` worden plat verzonden, niet genest als `payment_term: {type, days}`. (2) `currency` plat i.p.v. `{code, exchange_rate}`. (3) `discount` i.p.v. `discounts`. (4) Geen `invoicee` wrapper in update. (5) Geen `custom_fields`. |
| invoices.updateBooked | MEDIUM | Zelfde als update: `payment_term` niet genest. |
| invoices.book | **HIGH** | Ontbreekt verplicht `on` (datum) veld. Stuurt alleen `{id}`. |
| invoices.copy | OK | |
| invoices.credit | OK | |
| invoices.creditPartially | MEDIUM | Stuurt `credit_note_lines` maar spec verwacht `grouped_lines`. Geen `discounts` support. |
| invoices.delete | OK | |
| invoices.download | OK | |
| invoices.info | OK | |
| invoices.list | LOW | Ontbreekt `ids`, `term`, `invoice_number`, `deal_id` filters |
| invoices.registerPayment | OK | `payment: {amount, currency}` correct genest |
| invoices.removePayments | OK | |
| invoices.send | **HIGH** | Stuurt alleen `{id}`. Spec vereist `content` (subject/body), `recipients` (to/cc/bcc), `attachments`. Operatie zal falen. |
| invoices.sendViaPeppol | OK | |

---

## 8. CREDIT NOTE

| Endpoint | Verdict | Details |
|---|---|---|
| creditNotes.download | OK | |
| creditNotes.info | OK | |
| creditNotes.list | LOW | Ontbreekt `ids`, `updated_since`, `invoice_id`, `project_id` filters |
| creditNotes.sendViaPeppol | OK | |

---

## 9. SUBSCRIPTION

| Endpoint | Verdict | Details |
|---|---|---|
| subscriptions.create | LOW | Alle required fields aanwezig en correct genest (`invoicee`, `billing_cycle`, `grouped_lines`, `payment_term`, `invoice_generation`). Ontbreekt `custom_fields` en `for_attention_of` in invoicee. |
| subscriptions.deactivate | OK | |
| subscriptions.info | OK | |
| subscriptions.list | LOW | Ontbreekt `ids`, `invoice_id`, `deal_id`, `department_id`, `customer` filters. Geen `sort`. |
| subscriptions.update | MEDIUM | Alleen `title`, `billing_cycle`, `note` beschikbaar. Ontbreekt `invoicee`, `payment_term`, `grouped_lines`, `custom_fields`. |

---

## 10. INCOMING INVOICE

| Endpoint | Verdict | Details |
|---|---|---|
| incomingInvoices.add | **HIGH** | (1) Ontbreekt verplicht veld `title` — niet in fields. (2) `currency` is optioneel en plat (string) i.p.v. verplicht en genest als `{code}`. (3) `total_amount` is plat getal, niet genest als `total: {tax_exclusive, tax_inclusive}`. |
| incomingInvoices.approve | OK | |
| incomingInvoices.delete | OK | |
| incomingInvoices.info | OK | |
| incomingInvoices.listPayments | OK | |
| incomingInvoices.markAsPendingReview | OK | |
| incomingInvoices.refuse | OK | |
| incomingInvoices.registerPayment | OK | `payment: {amount, currency}` correct |
| incomingInvoices.removePayment | OK | |
| incomingInvoices.sendToBookkeeping | OK | |
| incomingInvoices.update | MEDIUM | `total_amount` plat i.p.v. `total: {tax_exclusive, tax_inclusive}`. Geen `currency` in update. |
| incomingInvoices.updatePayment | OK | |

---

## 11. INCOMING CREDIT NOTE

| Endpoint | Verdict | Details |
|---|---|---|
| incomingCreditNotes.add | **HIGH** | Zelfde als incomingInvoices.add: ontbreekt `title`, `currency` plat i.p.v. `{code}`, `total_amount` plat i.p.v. genest. |
| incomingCreditNotes.approve | OK | |
| incomingCreditNotes.delete | OK | |
| incomingCreditNotes.info | OK | |
| incomingCreditNotes.listPayments | OK | |
| incomingCreditNotes.markAsPendingReview | OK | |
| incomingCreditNotes.refuse | OK | |
| incomingCreditNotes.registerPayment | OK | |
| incomingCreditNotes.removePayment | OK | |
| incomingCreditNotes.sendToBookkeeping | OK | |
| incomingCreditNotes.update | MEDIUM | `total_amount` plat i.p.v. genest. Geen `currency` in update. |
| incomingCreditNotes.updatePayment | OK | |

---

## 12. QUOTATION

| Endpoint | Verdict | Details |
|---|---|---|
| quotations.create | **HIGH** | (1) Spec vereist `deal_id` als required, n8n heeft het optioneel in additionalFields. (2) n8n stuurt `customer: {type, id}` op root maar spec noemt dit niet als top-level veld. (3) Geen `discounts` support. (4) Geen `expiry` support. Currency nesting is correct. |
| quotations.delete | OK | |
| quotations.download | LOW | Geen `format` keuze in UI (default PDF). |
| quotations.info | OK | |
| quotations.list | LOW | Ontbreekt `ids` filter. |
| quotations.send | **HIGH** | Stuurt alleen `{id}`. Spec vereist `quotations` (array), `recipients`, `subject`, `content`, `language`. Operatie zal falen. |
| quotations.update | MEDIUM | Geen `currency` nesting in update. Geen `discounts` of `expiry`. |

---

## 13. RECEIPT

| Endpoint | Verdict | Details |
|---|---|---|
| receipts.add | OK | `currency: {code}` en `total: {tax_inclusive: {amount}}` correct |
| receipts.approve | OK | |
| receipts.delete | OK | |
| receipts.info | OK | |
| receipts.listPayments | OK | |
| receipts.markAsPendingReview | OK | |
| receipts.refuse | OK | |
| receipts.registerPayment | OK | |
| receipts.removePayment | OK | |
| receipts.sendToBookkeeping | OK | |
| receipts.update | MEDIUM | `total_amount` plat i.p.v. genest als `total: {tax_inclusive: {amount}}`. Geen `currency` in update. |
| receipts.updatePayment | OK | |

---

## 14. EVENT

| Endpoint | Verdict | Details |
|---|---|---|
| events.create | OK | `attendees` en `links` als JSON arrays correct geparsed |
| events.cancel | OK | |
| events.info | OK | |
| events.list | LOW | Ontbreekt `ids` en `user_id` filters |
| events.update | OK | |

---

## 15. MEETING

| Endpoint | Verdict | Details |
|---|---|---|
| meetings.schedule | LOW | `attendees` correct als required. `customer` nesting correct. Ontbreekt `custom_fields`. |
| meetings.complete | OK | |
| meetings.createReport | **HIGH** | Stuurt `{id, body}` maar spec vereist `{id, attach_to: {type, id}}`. Geen `attach_to` veld aanwezig. `body` is niet in de spec. Structuur klopt niet. |
| meetings.delete | OK | |
| meetings.info | OK | |
| meetings.list | LOW | Spec filters (`ids`, `employee_id`, `start_date`, `end_date`, `milestone_id`) niet aanwezig. Filter namen matchen ook niet (`starts_after`/`starts_before` vs `start_date`/`end_date`). Geen `sort`. |
| meetings.update | MEDIUM | `attendees` JSON parsing correct. Maar `customer` nesting ontbreekt in update (wel in schedule). Geen `custom_fields`. |

---

## 16. CALL

| Endpoint | Verdict | Details |
|---|---|---|
| calls.add | LOW | `participant` en `assignee` nesting correct. Ontbreekt `custom_fields`. |
| calls.complete | OK | |
| calls.info | OK | |
| calls.list | LOW | Geen filters collection. Alle spec filters ontbreken (`scheduled_after`, `scheduled_before`, `relates_to`, `call_outcome_id`). |
| calls.update | MEDIUM | Kan alleen `outcome_id` en `summary` updaten. Geen `participant`, `assignee`, `due_at`, `description`, of `custom_fields` velden. |

---

## 17. TIME TRACKING

| Endpoint | Verdict | Details |
|---|---|---|
| timeTracking.add | OK | `subject: {type, id}` correct genest |
| timeTracking.delete | OK | |
| timeTracking.info | OK | |
| timeTracking.list | LOW | Ontbreekt `ids` en `ended_after` filters |
| timeTracking.resume | OK | |
| timeTracking.update | **HIGH** | `subject_type`/`subject_id` worden plat verzonden via `assignDefined` i.p.v. genest als `subject: {type, id}`. |

---

## 18. TIMER

| Endpoint | Verdict | Details |
|---|---|---|
| timers.current | OK | |
| timers.start | OK | `subject` correct genest |
| timers.stop | OK | |
| timers.update | MEDIUM | Geen `subject` (type+id) velden beschikbaar in update. Kan timer subject niet wijzigen. |

---

## 19. NOTE

| Endpoint | Verdict | Details |
|---|---|---|
| notes.create | LOW | `subject: {type, id}` correct. Ontbreekt `notify` array (optioneel). |
| notes.list | OK | |
| notes.update | OK | |

---

## 20. TASK (activities)

| Endpoint | Verdict | Details |
|---|---|---|
| tasks.create | **HIGH** | (1) `work_type_id` is verplicht per spec maar optioneel in n8n. (2) Veldnaam `due_date` maar spec verwacht `due_on`. (3) `assignee` wordt plat als `assignee_id` verzonden i.p.v. `{type: 'user', id}`. (4) `estimated_duration` plat getal i.p.v. `{unit, value}`. `customer` en `custom_fields` zijn correct. |
| tasks.complete | OK | |
| tasks.delete | OK | |
| tasks.info | OK | |
| tasks.list | LOW | Filter namen matchen niet (`assignee_id` vs `user_id`, `status` vs `completed`). Ontbreekt `ids`, `milestone_id`. Geen `sort`. |
| tasks.reopen | OK | |
| tasks.schedule | **HIGH** | Stuurt enkel `scheduled_at` (1 veld) maar spec vereist `starts_at` + `ends_at` (2 velden). |
| tasks.update | MEDIUM | `assignee` plat verzonden. Ontbreekt `estimated_duration` en `customer` velden. `custom_fields` correct. |

---

## 21. PROJECT (v2)

| Endpoint | Verdict | Details |
|---|---|---|
| projects.create | MEDIUM | `billingMethod` is required in n8n maar niet in spec. Geen geneste velden: `time_budget`, `external_budget`, `internal_budget`, `fixed_price`, `owner_ids[]`, `customers[]`, `assignees[]`, `deal_ids[]`, `quotation_ids[]`, `initial_*`. `custom_fields` OK. |
| projects.update | MEDIUM | `billing_method` plat string i.p.v. `{value, update_strategy}`. Geen budget velden. `custom_fields` OK. |
| projects.delete | OK | |
| projects.duplicate | **HIGH** | Ontbreekt verplicht `title` veld. Stuurt alleen `{id}`. |
| projects.info | OK | |
| projects.list | OK | |
| projects.close | OK | |
| projects.reopen | OK | |
| projects.addCustomer | OK | `customer: {type, id}` correct |
| projects.removeCustomer | OK | |
| projects.addDeal | OK | |
| projects.removeDeal | OK | |
| projects.addOwner | OK | |
| projects.removeOwner | OK | |
| projects.addQuotation | OK | |
| projects.removeQuotation | OK | |
| projects.assign | OK | `assignee: {type, id}` correct |
| projects.unassign | OK | |

---

## 22. PROJECT GROUP

| Endpoint | Verdict | Details |
|---|---|---|
| projectGroups.create | MEDIUM | (1) Veld heet `name` maar spec zegt `title`. (2) Geen geneste budget velden (`fixed_price`, `external_budget`, `internal_budget`). (3) Geen `assignees[]`. |
| projectGroups.update | MEDIUM | Alleen `name` beschikbaar. Geen budget of `billing_method` velden. |
| projectGroups.delete | OK | |
| projectGroups.duplicate | MEDIUM | Spec vereist `origin_id` maar n8n stuurt `id`. |
| projectGroups.info | OK | |
| projectGroups.list | LOW | `project_id` als top-level param i.p.v. `filter.project_id`. |
| projectGroups.assign | OK | |
| projectGroups.unassign | OK | |

---

## 23. PROJECT TASK

| Endpoint | Verdict | Details |
|---|---|---|
| projectTasks.create | MEDIUM | (1) `groupId` is required in n8n maar niet in spec. (2) `estimated_duration` plat getal (seconden) i.p.v. `time_estimated: {value, unit}`. (3) Geen budget/rate velden. (4) Geen `assignees[]`. |
| projectTasks.update | MEDIUM | Geen geneste budget/rate velden. `time_estimated` niet als genest object. |
| projectTasks.delete | OK | |
| projectTasks.duplicate | MEDIUM | Spec vereist `origin_id`, n8n stuurt `id`. |
| projectTasks.info | OK | |
| projectTasks.list | LOW | `project_id` als top-level param; spec toont alleen `filter={ids}`. |
| projectTasks.assign | OK | |
| projectTasks.unassign | OK | |

---

## 24. PROJECT MATERIAL

| Endpoint | Verdict | Details |
|---|---|---|
| projectMaterials.create | MEDIUM | (1) `groupId` required in n8n maar niet in spec. (2) `unit_price_amount` plat i.p.v. `unit_price: {amount, currency}`. (3) Ontbreekt `unit_cost`, `fixed_price`, `external_budget`, `internal_budget`, `assignees[]`. |
| projectMaterials.update | MEDIUM | Geen geneste price/cost/budget velden. |
| projectMaterials.delete | OK | |
| projectMaterials.duplicate | MEDIUM | Spec vereist `origin_id`, n8n stuurt `id`. |
| projectMaterials.info | OK | |
| projectMaterials.list | LOW | `project_id` als top-level param. |
| projectMaterials.assign | OK | |
| projectMaterials.unassign | OK | |

---

## 25. EXTERNAL PARTY

| Endpoint | Verdict |
|---|---|
| externalParties.addToProject | OK |
| externalParties.delete | OK |
| externalParties.update | OK |

---

## 26. PROJECT LINE

| Endpoint | Verdict |
|---|---|
| projectLines.addToGroup | OK |
| projectLines.list | OK |
| projectLines.removeFromGroup | OK |

---

## 27. PRODUCT

| Endpoint | Verdict | Details |
|---|---|---|
| products.add | LOW | `name` is required in n8n maar spec zegt geen required fields. |
| products.delete | OK | |
| products.info | OK | |
| products.list | OK | |
| products.update | MEDIUM | `unit_price_amount` plat i.p.v. `selling_price: {amount, currency}`. Ontbreekt `purchase_price`, `price_list_prices[]`, `stock`, `configuration`, `custom_fields[]`. |

---

## 28. TICKET

| Endpoint | Verdict | Details |
|---|---|---|
| tickets.create | **HIGH** | (1) `customer` en `ticket_status_id` zijn verplicht per spec maar optioneel (in additionalFields) in n8n. (2) `assignee` plat als `assignee_id` i.p.v. genest `{type, id}`. (3) `message` is required in n8n maar niet in spec. (4) `participant` ontbreekt. |
| tickets.update | MEDIUM | `assignee_id` plat i.p.v. genest. Geen `customer`, `participant` in update. |
| tickets.info | OK | |
| tickets.list | OK | |
| tickets.addReply | OK | |
| tickets.addInternalMessage | OK | |
| tickets.importMessage | OK | |
| tickets.getMessage | OK | |
| tickets.listMessages | LOW | Geen message-level filters (type, created_before, created_after). |

---

## 29. USER

| Endpoint | Verdict |
|---|---|
| users.me | OK |
| users.info | OK |
| users.list | OK |
| users.getWeekSchedule | OK |
| users.listDaysOff | OK |

---

## 30. DEPARTMENT

| Endpoint | Verdict |
|---|---|
| departments.info | OK |
| departments.list | OK |

---

## 31. TEAM

| Endpoint | Verdict |
|---|---|
| teams.list | OK |

---

## 32. FILE

| Endpoint | Verdict |
|---|---|
| files.upload | OK |
| files.download | OK |
| files.delete | OK |
| files.info | OK |
| files.list | OK |

---

## 33. DAY OFF

| Endpoint | Verdict | Details |
|---|---|---|
| daysOff.import | **HIGH** | Stuurt `{days_off: [...]}` maar spec verwacht `{user_id, leave_type_id, days: [...]}`. Ontbreekt verplichte velden en verkeerde key naam. |
| daysOff.bulkDelete | **HIGH** | Stuurt `{days_off: [...]}` maar spec verwacht `{user_id, ids: [...]}`. Ontbreekt `user_id` en verkeerde key naam. |
| dayOffTypes.list | OK | |
| dayOffTypes.create | LOW | Geen `date_validity: {from, until}` genest veld. |
| dayOffTypes.delete | OK | |
| dayOffTypes.update | LOW | Geen `date_validity: {from, until}` genest veld. |

---

## 34. CLOSING DAY

| Endpoint | Verdict | Details |
|---|---|---|
| closingDays.add | MEDIUM | Stuurt `date` maar spec verwacht veldnaam `day`. |
| closingDays.delete | OK | |
| closingDays.list | OK | |

---

## 35. EMAIL TRACKING

| Endpoint | Verdict | Details |
|---|---|---|
| emailTracking.create | **HIGH** | Stuurt `url` maar spec verwacht veldnaam `content`. |
| emailTracking.list | OK | |

---

## 36. WEBHOOK

| Endpoint | Verdict | Details |
|---|---|---|
| webhooks.register | OK | |
| webhooks.unregister | MEDIUM | Stuurt `{id}` maar spec verwacht `{url, types[]}`. |
| webhooks.list | OK | |

---

## 37. ORDER

| Endpoint | Verdict |
|---|---|
| orders.info | OK |
| orders.list | OK |

---

## 38. PLANNABLE ITEM

| Endpoint | Verdict | Details |
|---|---|---|
| plannableItems.info | MEDIUM | Stuurt `{id}` maar spec verwacht `source: {id, type}` genest object. |
| plannableItems.list | OK | |

---

## 39. RESERVATION

| Endpoint | Verdict |
|---|---|
| reservations.create | OK |
| reservations.delete | OK |
| reservations.list | OK |
| reservations.update | OK |

---

## 40. USER AVAILABILITY

| Endpoint | Verdict |
|---|---|
| userAvailability.daily | OK |
| userAvailability.total | OK |

---

## 41. EXPENSE

| Endpoint | Verdict |
|---|---|
| expenses.list | OK |

---

## 42. BOOKKEEPING SUBMISSION

| Endpoint | Verdict |
|---|---|
| bookkeepingSubmissions.list | OK |

---

---

# SAMENVATTING: Alle HIGH-severity issues

| # | Endpoint | Probleem |
|---|---|---|
| 1 | **dealPhases.create** | Ontbreekt verplicht `requires_attention_after: {amount, unit}`. Veldnaam `pipeline_id` vs spec `deal_pipeline_id`. |
| 2 | **dealPhases.move** | Stuurt `position` (getal) i.p.v. `after_phase_id` (UUID). Compleet verkeerde parameter. |
| 3 | **dealPhases.update** | Stuurt plat `requires_attention_after_days` i.p.v. genest `requires_attention_after: {amount, unit}`. |
| 4 | **invoices.book** | Ontbreekt verplicht `on` (datum) veld. |
| 5 | **invoices.send** | Stuurt alleen `{id}`. Ontbreekt `content`, `recipients`, `attachments`. Zal falen. |
| 6 | **quotations.create** | Spec vereist `deal_id` als required. n8n stuurt `customer` op root (niet in spec). |
| 7 | **quotations.send** | Stuurt alleen `{id}`. Ontbreekt `quotations[]`, `recipients`, `subject`, `content`, `language`. Zal falen. |
| 8 | **incomingInvoices.add** | Ontbreekt verplicht `title`. `currency` plat i.p.v. `{code}`. `total` niet genest. |
| 9 | **incomingCreditNotes.add** | Zelfde als incomingInvoices.add. |
| 10 | **tickets.create** | `customer` en `ticket_status_id` verplicht per spec maar optioneel in n8n. `assignee` plat i.p.v. genest. |
| 11 | **tasks.create** | `work_type_id` optioneel i.p.v. required. `due_date` vs spec `due_on`. `assignee` plat. `estimated_duration` plat i.p.v. `{unit, value}`. |
| 12 | **tasks.schedule** | Stuurt `scheduled_at` (1 veld) i.p.v. spec's `starts_at` + `ends_at` (2 velden). |
| 13 | **timeTracking.update** | `subject_type`/`subject_id` plat verzonden i.p.v. genest als `subject: {type, id}`. |
| 14 | **meetings.createReport** | Stuurt `{id, body}` maar spec vereist `{id, attach_to: {type, id}}`. Verkeerde structuur. |
| 15 | **projects.duplicate** | Ontbreekt verplicht `title` veld. |
| 16 | **daysOff.import** | Stuurt `{days_off: [...]}` maar spec verwacht `{user_id, leave_type_id, days: [...]}`. |
| 17 | **daysOff.bulkDelete** | Stuurt `{days_off: [...]}` maar spec verwacht `{user_id, ids: [...]}`. |
| 18 | **emailTracking.create** | Stuurt `url` maar spec verwacht `content`. |

# SAMENVATTING: Alle MEDIUM-severity issues

| # | Endpoint | Probleem |
|---|---|---|
| 1 | dealPipelines.delete | Ontbreekt `migrate_phases` parameter |
| 2 | invoices.draft | `currency` plat, `discount` vs `discounts`, geen `custom_fields` |
| 3 | invoices.update | `payment_term` niet genest, `currency` plat, geen `invoicee` wrapper |
| 4 | invoices.updateBooked | `payment_term` niet genest |
| 5 | invoices.creditPartially | Veldnaam `credit_note_lines` vs spec `grouped_lines` |
| 6 | subscriptions.update | Ontbreekt `invoicee`, `payment_term`, `grouped_lines`, `custom_fields` |
| 7 | incomingInvoices.update | `total_amount` plat i.p.v. genest |
| 8 | incomingCreditNotes.update | `total_amount` plat i.p.v. genest |
| 9 | quotations.update | Geen `currency` nesting, geen `discounts`, geen `expiry` |
| 10 | receipts.update | `total_amount` plat i.p.v. genest |
| 11 | meetings.update | `customer` nesting ontbreekt (wel in schedule), geen `custom_fields` |
| 12 | calls.update | Zeer beperkt: alleen `outcome_id` en `summary`. Geen `participant`, `assignee`, `due_at`, `custom_fields` |
| 13 | timers.update | Geen `subject` velden beschikbaar |
| 14 | tasks.update | `assignee` plat, ontbreekt `estimated_duration` en `customer` |
| 15 | project.create | Ontbreekt geneste budget/time_budget velden, geen owner_ids/customers/assignees/deal_ids |
| 16 | project.update | `billing_method` plat i.p.v. `{value, update_strategy}`. Geen budget velden. |
| 17 | projectGroups.create | `name` vs spec `title`. Geen budget velden. |
| 18 | projectGroups.update | Alleen `name`. Geen budget/billing_method. |
| 19 | projectGroups.duplicate | Stuurt `id` maar spec verwacht `origin_id` |
| 20 | projectTasks.create | `groupId` niet verplicht per spec. `estimated_duration` plat. Geen budget velden. |
| 21 | projectTasks.update | Geen geneste budget/rate velden |
| 22 | projectTasks.duplicate | Stuurt `id` maar spec verwacht `origin_id` |
| 23 | projectMaterials.create | `unit_price_amount` plat. Geen overige budget velden. |
| 24 | projectMaterials.update | Geen geneste price/cost/budget velden |
| 25 | projectMaterials.duplicate | Stuurt `id` maar spec verwacht `origin_id` |
| 26 | products.update | `unit_price_amount` plat i.p.v. `selling_price: {amount, currency}` |
| 27 | tickets.update | `assignee_id` plat i.p.v. genest. Geen `customer` of `participant`. |
| 28 | closingDays.add | Veldnaam `date` vs spec `day` |
| 29 | webhooks.unregister | Stuurt `{id}` maar spec verwacht `{url, types[]}` |
| 30 | plannableItems.info | Stuurt `{id}` maar spec verwacht `source: {id, type}` |

---

*Gegenereerd op 2026-03-01 door audit tegen api-specs/1.115.0.yaml*
