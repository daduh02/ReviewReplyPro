# Admin Guide

## Roles

### Super Admin

Implemented:

- Can access all businesses, locations, reviews, generated replies, saved replies, brand voice settings, leads, admin users and billing/admin controls.
- Can add and manage admin users.
- Can assign Business Admin users to workspaces.
- Can manage accounts and locations.
- Can access the Super Admin documentation page.

### Business Admin

Implemented:

- Can access assigned workspaces only.
- Can view assigned dashboard data.
- Can manage reviews, replies, saved replies and brand voice settings for assigned businesses.

Planned:

- More granular permissions for individual locations and actions.

## Adding Pilot Customers

Implemented paths:

- Super Admin can add accounts from `/admin/accounts`.
- Admins can use the first-time business setup wizard at `/app/setup`.

Recommended process:

1. Create the workspace/account.
2. Set `account_type = pilot`.
3. Set plan to `Pilot` or `Free for Life`.
4. Set billing status to `exempt` for pilot/free accounts.
5. Add at least one location.
6. Add brand voice settings for each location.
7. Assign the relevant Business Admin user to the workspace.

## Managing Businesses

Use `/admin/accounts`.

Implemented:

- Add accounts.
- Update account name, type, plan, billing status, billing interval and monthly price.
- Activate or deactivate accounts.
- See Pilot Customer and Free for Life badges.
- Prevent deletion of Pilot and Customer accounts.

Protected rule:

- Only Demo accounts should be removable/resettable.

## Managing Locations

Use `/admin/accounts`.

Implemented fields:

- Business name
- Business type
- Location name
- Address
- Phone
- Website
- Google rating
- Google review count
- Price range
- Google Business Profile readiness fields

Protected rule:

- Pilot and Customer locations should not be deleted through demo/reset actions.

## Managing Reviews

Use `/app/reviews`.

Implemented:

- View reviews.
- Filter by location, status and rating.
- Search reviews.
- Sort newest or oldest.
- Open review details.
- Add reviews manually from `/app/generate`.

Statuses used in the workflow:

- New
- Drafted
- Edited
- Copied
- Posted
- Archived

## Managing Replies

Use the review detail page.

Implemented:

- Generate three reply options.
- Select a reply option.
- Edit reply text.
- Save reply.
- Copy reply.
- Mark reply as posted.
- Archive review.
- Track activity events for reply actions.

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

## Converting Pilot Customer to Paid Customer

Implemented manually:

1. Open `/admin/accounts`.
2. Change account type to `customer`.
3. Change plan to `Paid`.
4. Change billing status to `active`.
5. Set billing interval to `monthly`.
6. Set monthly price in pounds.

Planned:

- Stripe-backed subscription creation and billing status sync.

## Protected Account Rules

Implemented:

- Demo accounts are resettable/removable.
- Pilot accounts are protected from accidental deletion.
- Customer accounts are protected from accidental deletion.
- Demo reset and seed refresh functions should not modify Pilot or Customer records.

