# Product Overview

## Product Purpose

ReviewReply Pro helps UK local businesses manage reviews and prepare professional, on-brand replies without needing a full CRM.

The product is designed around a practical review workflow:

1. Add or receive a review.
2. Generate three reply options.
3. Select the best option.
4. Edit the reply if needed.
5. Copy the reply for Google.
6. Mark it as posted.
7. Keep a saved history for future use.

## Target Users

Implemented target user groups:

- Super Admin: manages the platform, pilot accounts, leads, users and billing controls.
- Business Admin: accesses assigned business workspaces and handles reviews/replies.

Target customer types:

- Restaurants and takeaways
- Salons, barbers and beauty studios
- Solicitors and professional services
- Garages, trades and estate agents
- Mosques, charities and community organisations

## Core Workflow

Implemented:

- Google OAuth login for authorised users
- Protected app and admin routes
- Persistent review inbox
- Manual review entry
- Location and status filters
- Rating filter, search and sorting
- Three generated reply options per review
- Reply editing
- Copy tracking
- Mark as posted
- Archive review
- Save replies to a reusable library
- Activity/audit tracking for review actions

In progress:

- Pilot testing with real businesses
- Refining reply prompts and brand voice handling from real feedback

Planned:

- Google Business Profile review sync
- Automated notifications
- Billing automation

## Pilot Customer Model

ReviewReply Pro supports three account types:

- Demo
- Pilot
- Customer

Implemented rules:

- Demo accounts can be reset or removed.
- Pilot and Customer accounts are protected from accidental deletion.
- Pilot and Customer accounts are included in real reporting and analytics.
- Business Admin access can be scoped to specific workspaces.

## Free for Life Pilot Plan

Implemented:

- The platform supports a `Free for Life` plan.
- Free for Life accounts use `billing_status = exempt`.
- Masjid As-Salaam is configured as a protected pilot account with Free for Life access.

Planned:

- More visible plan transition tooling from Pilot to Paid Customer.
- Billing automation through Stripe for paid customers.

## Google Business Profile Integration Approach

Implemented now:

- Google OAuth is implemented for admin/customer login.
- The data model includes Google Business Profile readiness fields:
  - Google Place ID
  - Google account ID
  - Google location ID
  - GBP sync enabled flag
  - Last import attempt timestamp
- UI copy says Google Business Profile integration is coming soon.

Not implemented yet:

- Real Google Business Profile review sync.
- Real Google Business Profile location listing.
- Real posting back to Google.

## Real Now vs Coming Later

Implemented now:

- Authentication
- Admin roles
- Persistent pilot/customer data
- Lead capture
- Manual reviews
- AI reply generation workflow
- Saved replies
- Brand voice settings
- Audit trail
- Super Admin documentation area

Coming later:

- Real GBP review import
- Scheduled sync
- Stripe billing lifecycle
- Email notifications
- Advanced analytics

