# OpsPilot AI

**Evidence-backed AI incident detection and resolution for GitHub Actions and modern deployments.**

OpsPilot receives failed workflow events, verifies the webhook, records the incident, analyses available log evidence, and produces a structured root cause, confidence score and developer-approved resolution plan.

## Why this project stands out

Most AI troubleshooting demos paste logs into a chatbot. OpsPilot is designed as a production system:

- secure GitHub webhook verification;
- idempotent delivery processing;
- PostgreSQL incident history;
- Redis and BullMQ background jobs;
- separate FastAPI analysis service;
- deterministic fallback when AI is unavailable;
- exact evidence lines attached to recommendations;
- confidence scoring and safe low-evidence behaviour;
- human approval before code-changing actions;
- Docker Compose and GitHub Actions CI.

## Current MVP

- Premium operations dashboard and incident detail views
- GitHub `workflow_run` webhook ingestion
- HMAC SHA-256 signature verification
- Duplicate-delivery prevention
- Evidence-backed failure classification
- Asynchronous queue with synchronous safe fallback
- Incident REST API and status updates
- Prisma/PostgreSQL data model
- FastAPI structured analysis service
- Portfolio demo mode without infrastructure
- Unit tests, Docker and CI

## Technology

- **Web:** Next.js 16, React 19, TypeScript
- **Data:** PostgreSQL and Prisma
- **Jobs:** Redis and BullMQ
- **AI service:** Python, FastAPI and Pydantic
- **Platform:** Docker Compose and GitHub Actions

## Run locally

```bash
cp .env.example .env
docker compose up -d postgres redis ai-service
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Open `http://localhost:3000`. Run `npm run worker` in a second terminal for queued analysis, or start everything with `docker compose up --build`.

## GitHub webhook

Configure a repository webhook with:

- URL: `https://YOUR_DOMAIN/api/webhooks/github`
- Content type: `application/json`
- Secret: the same value as `GITHUB_WEBHOOK_SECRET`
- Event: **Workflow runs**

A normal workflow webhook does not contain the complete log archive. The MVP safely reports incomplete evidence. The next milestone is a GitHub App token that downloads failed job logs before analysis.

## API

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/health` | Configuration health |
| `POST` | `/api/webhooks/github` | Receive verified GitHub events |
| `GET` | `/api/incidents` | List incidents |
| `GET` | `/api/incidents/:id` | Read incident details |
| `PATCH` | `/api/incidents/:id` | Update status or assignment |
| `POST` | `AI_SERVICE/v1/analyse` | Structured incident analysis |

## Safety principles

OpsPilot does not claim certainty when evidence is weak and does not execute suggested fixes automatically. Every code-changing action remains reviewable and approval-based.

## Roadmap

- GitHub App OAuth and full workflow logs
- pgvector runbook retrieval
- Team workspaces and RBAC
- Workflow rerun, issue and draft PR actions
- Slack and email notifications
- Automated postmortems and observability

## Author

Built by **Muhammad Musammil** as a flagship full-stack, AI and DevOps portfolio project.
