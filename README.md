# lpclick

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines Next.js, Self, TRPC, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **tRPC** - End-to-end type-safe APIs
- **Prisma** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Better-Auth

## Getting Started

First, install the dependencies:

```bash
npm install
```

## Database Setup

This project uses PostgreSQL with Prisma.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/web/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:

```bash
npm run db:push
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the fullstack application.

## Project Structure

```
lpclick/
├── apps/
│   └── web/         # Fullstack application (Next.js)
├── packages/
│   ├── api/         # API layer / business logic
│   ├── auth/        # Authentication configuration & logic
│   └── db/          # Database schema & queries
```

## Available Scripts

- `npm run dev`: Start all applications in development mode
- `npm run build`: Build all applications
- `npm run check-types`: Check TypeScript types across all apps
- `npm run db:push`: Push schema changes to database
- `npm run db:generate`: Generate database client/types
- `npm run db:migrate`: Run database migrations
- `npm run db:studio`: Open database studio UI

## Lead observation correlation

After the existing validation succeeds, each CRM form calls
`captureLeadObservation()` once. It accepts only the SDK's opaque observation ID
matching `^obs_[A-Za-z0-9_-]{8,64}$`. An unavailable, older or failing SDK returns
no usable ID and the submission continues.

`sendCorrelatedLeadEvent()` preserves the existing `buttonWhatsappClicked` event
and adds a top-level `lead_observation_id`, or `null` when unavailable. It then
attempts exactly one non-event `{ lead_observation_id: null }` message, including
when sending the event throws. GTM processes the queue in order, so the cleanup
prevents subsequent unrelated clicks from inheriting the ID without emitting
another conversion. The helper never replaces the dataLayer. It returns `true`
only when both `sendGTMEvent` invocations return without throwing, and `false`
when either or both throw. Failures do not escape the helper, so callers can
ignore the result and continue submission. A `true` result does not prove that
GTM loaded, the messages were queued, tags fired or GA4 received anything.

The 18 forms that already send to `/api/leads` merge the same validated ID into
`payload.data.lead_observation_id` without changing other fields. The six forms
without that request keep their existing flow. The direct RunVeloz CRM request
keeps its existing contract, endpoint and payload; its duplicate SDK capture was
removed. Persistence of this ID in RunVeloz has **not** been verified and requires
the CRM's confirmed field mapping before any new field is sent there.

The dependency manifest and lockfile remain unchanged. SDK 0.4.0 and 0.4.1 return
`void`, so correlation remains unavailable with those versions. Activation requires
publication of the verified 0.4.2 candidate, followed by the dependency update and
validation. Merge, package publication and application release require the owner's
explicit approval. No SDK code is copied into the application and no fallback ID
is generated.

Run the local suite with installed TypeScript and Node:

```bash
node --test test/lead-observation.test.mjs
node node_modules/typescript/bin/tsc --noEmit --incremental false -p apps/web/tsconfig.json
```

The suite executes the actual helper, CRM serializer and existing legacy senders
in a fake browser with mocked SDK/GTM/fetch. It checks ID equality, unavailable
and invalid IDs, failures, immutable payloads, unchanged CRM bytes/defaults,
beacon/fetch paths, and FIFO state for live and late container models. AST wiring
checks cover all 24 forms; these checks are structural coverage, not UI execution
or evidence of production GA4/CRM receipt. This repository has no existing test
script, PR CI, formatter or linter configuration. New code and changed statements
follow the existing semicolon/double-quote style, checked with locally available
Prettier. An offline build with synthetic fonts and empty database responses proves
compilation and rendering only, not real database integration or delivery.
