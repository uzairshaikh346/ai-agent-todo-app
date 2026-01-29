# Multi-User Todo Web App + AI Chatbot Constitution (Spec-Kit Plus)

## Preamble
This constitution defines the immutable architectural, technological, security, quality, and workflow principles for the entire project lifecycle. All specifications, plans, tasks, implementations, and code generation MUST comply with these rules. Any deviation requires explicit amendment with rationale, version bump, and approval.

Version: 1.0.0
Ratified: 2026-01-20
Last Amended: 2026-01-20
Governed by Spec-Kit Plus (/sp.* commands) and enforced via templates in .specify/templates/

## I. Project Identity & Purpose
- Build a secure, scalable, multi-user Todo web application with natural language AI chatbot interface.
- Core goal: Users manage todos via UI or conversational AI (using MCP tools + OpenAI Agents SDK).
- Non-negotiable: Multi-user isolation (row-level ownership), persistent data (Neon Postgres), JWT auth, stateless services.

## II. Technology Stack (Opinionated & Immutable)
Frontend:
- Next.js 16+ (App Router only)
- OpenAI ChatKit for AI chatbot UI (custom backend connector)

Backend:
- FastAPI (Python 3.12+)
- SQLModel (ORM + Pydantic models)
- uv for venv, deps, scripts
- Official MCP SDK for tool exposure

AI Layer:
- OpenAI Agents SDK for agent logic, tool calling, stateless runner
- MCP tools bridge all task operations

Database:
- Neon Serverless PostgreSQL (serverless only)

Auth:
- Better Auth (JWT issuance & validation)

No replacements allowed without constitution amendment. No additional frameworks/languages unless explicitly added here.

## III. Security & Access Control
- ALL API endpoints (including /api/{user_id}/chat) MUST require valid JWT.
- Extract user_id from JWT claims (Better Auth integration).
- Row-level security: Every operation (CRUD on Task, access to Conversation/Message) MUST check task/conversation.user_id == authenticated user_id.
- Secrets: .env only (DB URL, JWT secret) — never commit.
- MCP tools: Stateless, always validate user_id ownership before DB ops.
- No global/shared state in backend.

## IV. Data Models & Persistence
Core models (enforced):
- Task: id, user_id (FK), title, description?, completed (bool), created_at, updated_at
- Conversation: id, user_id (FK), created_at, updated_at
- Message: id, conversation_id (FK), user_id, role ("user"|"assistant"), content, created_at, tool_calls? (JSON/array)

All models via SQLModel. Migrations with Alembic. Timestamps auto-managed.

## V. API & MCP Design Rules

- RESTful where applicable, but single stateless chat endpoint: POST /api/{user_id}/chat
- Request: {conversation_id?, message}
- Response: {conversation_id, response, tool_calls?}
- MCP tools (via Official SDK):
  - add_task(user_id, title, description?)
  - list_tasks(user_id, status? ["all","pending","completed"])
  - complete_task(user_id, task_id)
  - delete_task(user_id, task_id)
  - update_task(user_id, task_id, title?, description?)
- Tools return: {task_id?, status, title?, tasks? (array for list)}
- Tools MUST be stateless and DB-persisted.

## VI. Agent & Chat Behavior
- Agent instructions: "Helpful todo assistant. Use MCP tools for actions. Always confirm changes friendly. Handle errors gracefully. Be concise."
- Stateless cycle: Load history from DB → append user msg → run agent → tool loop → store assistant msg + tool_calls → return.
- Conversation state in DB (Conversation + Message tables).
- No in-memory state.

## VII. Development Workflow (Spec-Kit Plus Enforced)
- All features via: /sp.specify → /sp.clarify → /sp.plan → /sp.tasks → /sp.implement
- No manual coding outside AI-generated diffs/PRs.
- Atomic tasks only.
- Tests: pytest for backend/tools/endpoint, before marking complete.
- Quality gates: Constitution compliance check before proceed.

## VIII. Quality & Testing Mandates
- TDD where possible (tests before impl in spec/plan).
- 100% coverage on MCP tools & chat endpoint.
- Error handling: User-friendly messages, no stack traces to client.
- Logging: Structured (e.g. structlog) for tool calls & errors.

## IX. Governance & Amendment
- Amendment requires: /sp.constitution command, justification, version bump, team approval.
- Versioning: MAJOR for breaking changes, MINOR for additions, PATCH for clarifications.
- Compliance: All specs/plans/tasks must reference applicable principles.
- Review: Quarterly governance review to assess principle effectiveness.