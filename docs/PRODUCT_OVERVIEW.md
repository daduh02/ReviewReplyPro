# Product Overview

Documentation Version: 0.2.0
Last Updated: 2026-06-09 17:38 BST
Status: Current platform state after documentation audit.

## Product Purpose

ReviewReply Pro helps UK local businesses manage reviews and prepare professional, on-brand replies without needing a full CRM.

Implemented workflow:

1. Add a review manually.
2. Generate three reply options.
3. Select the best option.
4. Edit the reply if needed.
5. Copy the reply for Google.
6. Mark it as posted.
7. Save useful replies.
8. Keep activity and reply history.

In Progress:

- Real pilot use with customer feedback.
- AI provider path hardening.

Planned:

- Importing reviews from Google Business Profile.
- Posting or guiding replies back to Google through a real GBP integration.

## Target Users

Implemented:

- Super Admin: manages the platform, pilot accounts, leads, users, documentation and billing/admin controls.
- Business Admin: accesses assigned business workspaces and handles reviews, replies, saved replies and brand voice settings.

Planned:

- More granular permissions by location and action.

## Core Workflow

Implemented:

- Google OAuth login for authorised users.
- Protected app and admin routes.
- Persistent review inbox.
- Manual review entry.
- Business/location filtering.
- Status filtering.
- Rating filtering.
- Search by customer, review, business or location.
- Newest/oldest sorting.
- Three generated reply options per review.
- Reply option selection.
- Reply editing.
- Clipboard copy with copied status.
- Mark as posted.
- Archive review.
- Save replies to a reusable library.
- Activity/audit tracking for workflow actions.

Implemented differently:

- The `/api/replies` route can call OpenAI when configured.
- The main review workflow currently uses the provider fallback path and returns deterministic local replies.

In Progress:

- Connecting the server action provider path to the real OpenAI call.
- Improving prompt observability and failure handling.

Planned:

- Real Google Business Profile review sync.
- Automated notifications.
- Billing automation.

## Pilot Customer Model

Implemented:

- Account types: Demo, Pilot and Customer.
- Demo accounts can be reset or removed.
- Pilot and Customer accounts are protected from accidental deletion.
- Pilot and Customer accounts are included in real reporting surfaces that read from the database.
- Business Admin access can be scoped to assigned workspaces.

Partially implemented:

- Admin overview still uses some legacy static demo/customer arrays for high-level counts.

Planned:

- Database-only reporting everywhere.

## Free for Life Pilot Plan

Implemented:

- `plan = Free for Life`
- `billing_status = exempt`
- `billing_interval = free_for_life`
- Protected from deletion as a Pilot Customer.
- Masjid As-Salaam is configured as a protected Free for Life Pilot Customer.

Planned:

- More explicit conversion tooling from Pilot to Paid Customer.
- Stripe-backed subscription lifecycle for paid customers.

## Google Business Profile Integration Approach

Implemented:

- Google OAuth is implemented for admin/customer login only.
- Location records include GBP readiness fields:
  - Google Place ID
  - Google account ID
  - Google location ID
  - GBP sync enabled flag
  - Last import attempt timestamp
  - Connection/status copy
- UI copy says Google Business Profile integration is coming soon.
- Manual review entry is active now.

Not implemented:

- Real Google Business Profile review sync.
- Real Google Business Profile location listing.
- Real posting replies back to Google.
- Scheduled sync jobs.

## Real Now vs Coming Later

Implemented:

- Authentication.
- Admin roles.
- Persistent pilot/customer data.
- Lead capture.
- Manual reviews.
- Reply generation workflow with local fallback replies.
- Saved replies.
- Brand voice settings.
- Activity trail.
- Super Admin documentation area.

In Progress:

- Main workflow OpenAI integration.
- Admin reporting alignment.
- Pilot customer onboarding improvements.

Planned:

- Real GBP review import.
- Scheduled sync.
- Stripe billing lifecycle.
- Email notifications.
- Advanced analytics.

## Documentation Health Check

Missing docs:

- Test plan.
- GBP implementation plan.
- Billing implementation plan.

Outdated docs:

- None after this audit.

Docs requiring review:

- This page after OpenAI provider and GBP sync work changes state.
