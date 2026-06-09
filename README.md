# ReviewReply Pro

ReviewReply Pro is a UK-focused SaaS MVP for local businesses that want professional, on-brand draft replies for Google and customer reviews.

The product is centred on a Review Inbox, not a basic paste-review prompt. Mock Google Business Profile reviews are imported into the inbox, 3 draft reply options are prepared, and the user can edit, copy, save, mark as posted, or archive each review.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma schema for a Postgres-compatible database
- Mock-first OpenAI provider abstraction
- Mock-first Google Business Profile provider abstraction
- Mock-safe Stripe checkout and webhook scaffolding
- Vercel-ready project structure

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

The app runs without real Google, Stripe, OpenAI, or database credentials. Demo data is loaded from local TypeScript modules.

## Useful commands

```bash
npm run lint
npm run typecheck
npm run build
```

## Mock providers

- `MockGoogleReviewsProvider` returns UK business locations and review examples.
- `MockAIReplyProvider` generates British English reply variants locally.
- Stripe checkout and webhooks return local-safe placeholder responses unless Stripe env vars are set.

## Future Google Business Profile integration

The `GoogleReviewsProvider` interface is ready for a real provider. Add OAuth, token storage, location listing, review fetching, and sync scheduling behind `GoogleBusinessProfileProvider`.

Required future env vars are listed in `.env.example`.

## Future Stripe setup

Add real Stripe SDK calls inside `createCheckoutSession`, configure `STRIPE_STARTER_PRICE_ID` and `STRIPE_PRO_PRICE_ID`, and validate webhook signatures before production use.

## Future OpenAI setup

Add an OpenAI SDK call inside `OpenAIReplyProvider`. Prompts should keep British English, follow the brand voice settings, and handle complaints calmly without admitting legal liability.

## Demo businesses

All businesses and reviews used in demo mode are fictional examples for product testing.

The seed-style demo data includes Example Hair Salon, Example Dental Practice,
Example Local Garage, Example Indian Restaurant, Example Estate Agents, and
Example Plumbing Services.
