# Pilot Customers

Documentation Version: 0.2.0
Last Updated: 2026-06-09 17:38 BST
Status: Current platform state after documentation audit.

## Pilot Customer Definition

Implemented:

- A Pilot Customer is a real business using ReviewReply Pro during MVP testing.
- Pilot Customers are not public demo content.
- Pilot Customer accounts use `account_type = pilot`.
- Pilot Customer accounts are protected from accidental deletion.
- Pilot Customer records are included in database-backed product workflows.

In Progress:

- Separating every remaining admin reporting surface from legacy static demo arrays.

## Free for Life Rules

Implemented:

- `plan = Free for Life`
- `billing_status = exempt`
- `billing_interval = free_for_life`
- `active = true`
- Protected from deletion

Usage rule:

- Free for Life should be used only where the business is intentionally granted permanent free access.

## Masjid As-Salaam

Implemented:

- Masjid As-Salaam is the first Free for Life Pilot Customer.
- It is treated as a protected Pilot Customer.
- It is not shown in public demo/sample datasets.
- Its replies should use respectful UK English and warm community wording.

Current intended account setup:

- Business name: Masjid As-Salaam
- Account type: Pilot
- Plan: Free for Life
- Billing status: Exempt
- Billing interval: Free for Life
- Active: True

## Other Pilot Businesses

Implemented:

- The internal customer data list also contains additional pilot customer records used to keep required pilot businesses available in the database.

Important data rule:

- Real pilot businesses must not be added to public marketing/demo pages unless explicitly approved.

## Adding the Next Pilot Businesses

Recommended process:

1. Collect business details.
2. Create the account in `/admin/accounts` or use `/app/setup`.
3. Set account type to `pilot`.
4. Add locations.
5. Add Google Business Profile readiness IDs if available.
6. Configure brand voice for each location.
7. Assign Business Admin access.
8. Add initial reviews manually.
9. Generate and review reply options with the business.

In Progress:

- Building a cleaner lead-to-pilot conversion workflow.

## Data Protection Rules

Implemented rules:

- Do not place real pilot data in public demo files.
- Do not show real pilot businesses on public marketing/demo pages unless explicitly approved.
- Do not reset pilot/customer records during demo refreshes.
- Do not delete pilot/customer accounts without explicit owner approval.
- Keep admin access limited to authorised Google accounts.

Known risk:

- Pilot records seeded from code can overwrite selected fields when the seeding function runs. Avoid editing seeded pilot constants casually.

## Information to Collect

For each pilot business collect:

- Business name
- Business type
- Account type
- Plan
- Billing status
- Location name
- Address
- Phone
- Website
- Google rating
- Google review count
- Google Place ID if available
- Google account ID if available
- Google location ID if available
- Preferred tone
- Preferred sign-off
- Words to use
- Words to avoid
- Complaint handling style
- Business Admin email address

## Documentation Health Check

Missing docs:

- Pilot onboarding checklist template.
- Data retention policy.

Outdated docs:

- None after this audit.

Docs requiring review:

- Pilot customer rules after GBP sync starts importing real reviews.
