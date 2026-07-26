# OpsPilot AI Architecture

## Goal

Turn CI/CD failures into evidence-backed, reviewable incident records without allowing an AI model to execute unverified code changes.

```text
GitHub workflow_run webhook
        ↓
HMAC verification + idempotency
        ↓
PostgreSQL delivery record
        ↓
Redis / BullMQ analysis queue
        ↓
Worker → FastAPI analyser → deterministic fallback
        ↓
Evidence + confidence + resolution plan
        ↓
Incident dashboard and human approval
```

## Trust model

1. Webhooks are verified with HMAC SHA-256 over the raw request body.
2. Delivery IDs are unique so retries cannot create duplicate incidents.
3. Every recommendation includes source evidence.
4. Weak evidence produces low confidence instead of invented certainty.
5. AI service failures fall back to deterministic rules.
6. Workflow reruns, issues and pull requests remain approval-gated.

## Components

- **Next.js:** dashboard, incident views, webhook and REST APIs.
- **PostgreSQL/Prisma:** users, repositories, deliveries, incidents, evidence and actions.
- **Redis/BullMQ:** asynchronous analysis and retry handling.
- **FastAPI:** bounded, structured incident analysis.
- **Docker Compose:** complete local development stack.
- **GitHub Actions:** type checking, tests, production build and Python validation.

## Next milestones

- GitHub App installation and full workflow-log retrieval
- Auth.js and multi-tenant workspaces
- pgvector runbook retrieval and similar-incident matching
- Approval-based GitHub workflow rerun, issue and draft PR actions
- Slack/email adapters and OpenTelemetry traces
