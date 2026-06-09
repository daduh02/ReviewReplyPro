# Pilot Customers

## Pilot Customer Definition

A Pilot Customer is a real business using ReviewReply Pro during MVP testing.

Pilot Customers are not demo content. They should:

- Persist permanently.
- Be included in real reporting.
- Be protected from accidental deletion.
- Have real locations, reviews, brand voice settings and saved replies.

## Free for Life Rules

Implemented:

- `plan = Free for Life`
- `billing_status = exempt`
- `active = true`
- Protected from deletion

Free for Life should be used only where the business is intentionally granted permanent free access.

## Masjid As-Salaam

Implemented:

- Masjid As-Salaam is the first Free for Life pilot account.
- It is treated as a protected Pilot Customer.
- It is not shown in public demo/sample datasets.
- Its replies should use respectful UK English and warm community wording.

Current intended account setup:

- Business name: Masjid As-Salaam
- Account type: Pilot
- Plan: Free for Life
- Billing status: Exempt
- Active: True

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

## Data Protection Rules

Pilot/customer data should be handled as real business data.

Rules:

- Do not place real pilot data in public demo files.
- Do not show real pilot businesses on public marketing/demo pages unless explicitly approved.
- Do not reset pilot/customer records during demo refreshes.
- Do not delete pilot/customer accounts without explicit owner approval.
- Keep admin access limited to authorised Google accounts.

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

