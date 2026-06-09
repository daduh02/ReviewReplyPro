# Admin Guide

Documentation Version: 0.2.0
Last Updated: 2026-06-09 17:38 BST
Status: Current platform state after documentation audit.

## Roles

### Super Admin

Implemented:

- Can access all businesses, locations, reviews, generated replies, saved replies, brand voice settings, leads, admin users and billing/admin controls.
- Can add, update and remove admin users.
- Can assign Business Admin users to workspaces.
- Can add and update Demo, Pilot and Paid Customer accounts.
- Can add and update locations.
- Can remove Demo accounts and Demo locations.
- Can access the Super Admin documentation page.

Planned:

- More detailed permission controls.
- Better audit surfaces for admin user changes.

### Business Admin

Implemented:

- Can access assigned workspaces only.
- Can view assigned dashboard data.
- Can manage reviews, replies, saved replies and brand voice settings for assigned businesses.

Planned:

- Location-level permissions.
- Action-level permissions.

## Adding Pilot Customers

Implemented:

- Super Admin can add accounts from `/admin/accounts`.
- Admins can use the first-time business setup wizard at `/app/setup`.
- `ensurePilotCustomerAccounts()` seeds protected pilot customer records from the internal customer data list.

Recommended process:

1. Create the workspace/account.
2. Set `account_type = pilot`.
3. Set plan to `Pilot` or `Free for Life`.
4. Set billing status to `exempt` for pilot/free accounts.
5. Add at least one location.
6. Add brand voice settings for each location.
7. Assign the relevant Business Admin user to the workspace.

In Progress:

- Cleaner conversion flow from lead to pilot account.

## Managing Businesses

Use `/admin/accounts`.

Implemented:

- Add accounts.
- Update account name, account type, plan, billing status, billing interval and monthly price.
- Activate or deactivate accounts.
- See Pilot Customer, Paid Customer and Free for Life badges.
- Prevent deletion of Pilot and Customer accounts.

Implemented differently:

- Monthly billing values can be stored, but Stripe billing is not active.

Protected rule:

- Only Demo accounts should be removable/resettable.

## Managing Locations

Use `/admin/accounts`.

Implemented:

- Add and update locations.
- Store business name, business type, location name, address, phone, website, Google rating, Google review count and price range.
- Store Google Business Profile readiness IDs.
- Remove locations only when their workspace is a Demo account.

Planned:

- Real GBP location connection and sync state.

## Managing Reviews

Use `/app/reviews` and `/app/generate`.

Implemented:

- View reviews.
- Filter by location, status and rating.
- Search reviews.
- Sort newest or oldest.
- Open review details.
- Add reviews manually from `/app/generate`.

Implemented statuses:

- New
- Draft ready
- Edited
- Copied
- Posted
- Archived

## Managing Replies

Use the review detail page.

Implemented:

- Generate three reply options.
- Regenerate reply options.
- Select a reply option.
- Edit reply text.
- Save reply to the library.
- Copy reply and mark copied.
- Mark reply as posted.
- Archive review.
- Track activity events for generated, selected, edited, copied, saved, posted and archived actions.

Implemented differently:

- Main workflow reply generation currently returns local fallback replies; the API route can call OpenAI separately.

In Progress:

- Connecting the main workflow provider directly to OpenAI when configured.

## Managing Leads and Enquiries

Use `/admin/leads`.

Implemented:

- View leads from the public pilot form.
- Search by business, contact, email or business type.
- Filter by status.
- Update lead status.
- KPI cards for total leads, new leads, demo booked and pilot customers.

Lead statuses:

- New
- Contacted
- Demo Booked
- Pilot Customer
- Not Interested

Planned:

- Convert lead to pilot/customer account from the lead detail flow.

## Converting Pilot Customer to Paid Customer

Implemented manually:

1. Open `/admin/accounts`.
2. Change account type to `customer`.
3. Change plan to `Paid`.
4. Change billing status to `active`.
5. Set billing interval to `monthly`.
6. Set monthly price in pounds.

Planned:

- Stripe-backed checkout or subscription creation.
- Webhook verification and billing status sync.

## Protected Account Rules

Implemented:

- Demo accounts are resettable/removable.
- Pilot accounts are protected from accidental deletion.
- Customer accounts are protected from accidental deletion.
- Demo location deletion is allowed only for Demo workspaces.
- Pilot/customer reviews, replies and settings are not removed by demo reset actions.

Known issue:

- The internal pilot seeding function upserts known pilot records from code, which is useful for ensuring required pilot accounts exist but should be treated carefully when editing those pilot records manually.

## Documentation Health Check

Missing docs:

- Lead-to-customer conversion runbook.
- Production support runbook.

Outdated docs:

- None after this audit.

Docs requiring review:

- Account management docs after billing automation ships.
