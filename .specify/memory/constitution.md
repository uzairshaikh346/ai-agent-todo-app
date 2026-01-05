<!-- 
Sync Impact Report:
- Version change: 1.0.0 → 1.2.0
- Modified principles: All principles replaced with Multi-User Todo Web App specific principles
- Added sections: Preamble, Articles I-XI with specific content
- Removed sections: Original placeholder principles
- Templates requiring updates: 
  - ✅ .specify/templates/plan-template.md - needs alignment check
  - ✅ .specify/templates/spec-template.md - needs alignment check  
  - ✅ .specify/templates/tasks-template.md - needs alignment check
  - ⚠ .specify/templates/commands/*.md - needs review for outdated references
  - ⚠ README.md - needs review for principle references
- Follow-up TODOs: None
-->
# Multi-User Todo Web Application Constitution

## Preamble

This Constitution establishes immutable architectural principles and development standards for the Multi-User Todo Web Application project. It serves as the foundational contract guiding all spec-driven development phases — from specification to implementation — and ensures consistent application of technology, quality, testing, and security requirements across features, artifacts, and generated code.

## Core Principles

### I. Project Identity and Purpose
The purpose of this project is to build a secure, responsive, multi-user Todo web application using a spec-driven development workflow and modern full-stack technologies.

Non-negotiable Principles:
- The application must support authenticated multi-user interaction.
- Responsibilities between frontend and backend must be clearly separated.
- All user data must persist reliably in the configured database.

### II. Architectural Standards
Technology Must-Use:
- Next.js 16.0.10 for the frontend with App Router.
- FastAPI for the backend API layer.
- SQLModel ORM for all database modeling.
- Neon Serverless PostgreSQL for persistent storage.
- Better Auth for authentication, issuing JWT tokens.
- uv for Python environment setup, dependency management, and backend execution.

No other frameworks, languages, or tools may replace these core technologies without formal constitutional amendment.

### III. Backend Environment & Initialization
- A Python virtual environment must be created inside the backend/ folder using uv.
- All backend dependencies (including FastAPI, SQLModel, Neon client, JWT libraries) must be installed within this virtual environment.
- The FastAPI application must be developed, executed, and maintained inside this environment.
- uv commands and tooling must be used to install, run, test, and manage the backend including migrations, environment setup, and execution.
- The backend project must define a clear module structure including entrypoint (main.py), API routers, models, and authentication logic.
- Environment variables, including database connection strings and shared JWT secrets, must be defined in a .env file and never committed to source control.

### IV. Security Principles
- Every API endpoint must be protected by JWT authentication.
- Backend services must validate JWT tokens on every request before performing any data operations.
- Users must only be authorized to access, modify, or delete resources that belong to them.
- Environment secrets (including shared JWT signing keys) must be securely stored in environment variables and not committed to version control.

### V. API Conduct Rules
- The backend API must follow REST conventions.
- All API endpoints must include path parameters for user identification and respond with data scoped to the authenticated user.
- Request and response formats must be documented in API spec files under the specs/api/ directory with clear examples for success and error cases.

### VI. Specification Governance
- All feature work must be proposed through a dedicated specification file (.md) inside the specs/ directory.
- Specifications must include:
  - Feature description
  - Success criteria
  - Data model definitions
  - Acceptance tests / expected behaviors
- A feature may not proceed to implementation without a valid specification and a completed planning phase.

## Additional Constraints

### Quality Assurance Mandates
- Specifications, plans, and tasks must pass constitutional compliance checks before implementation begins.
- Qwen CLI workflows and Spec-Kit Plus tooling must enforce the quality gates defined in the project's quality assurance system.
- No code may be marked complete without passing its specified test suite and matching the documented behavior in the specification.

### LLM Knowledge and Context Access
- The project environment must provide a live connection to the MCP server containing project documentation and spec artifacts.
- When an LLM (including Qwen CLI, Claude Code integration, or any supported assistant) is unable to understand or resolve a specification, plan, or code context, it must fallback to reading the MCP-connected documentation source before generating implementation steps or recommendations.
- The LLM's fallback documentation sources include:
  - MCP server documentation endpoint (configured in Spec-Kit Plus settings)
  - The specs/ directory with markdown spec files
  - Monorepo guidance files (e.g., CLAUDE.md, architecture specs)
  - Project memory references as applicable
- The LLM must not produce speculative, undocumented behaviors for:
  - Feature requirements
  - API behavior
  - Data model definitions
  without first consulting MCP or approved spec artifacts.
- If the LLM cannot locate relevant information, it must indicate "Documentation reference required" rather than generate assumptions and list the spec sources it attempted to consult.

## Development Workflow

### Planning and Task Standards
- Every specification must be followed by an implementation plan generated with Spec-Kit Plus tools (e.g., /sp.plan).
- Implementation plans must list:
  - Technical design and rationale
  - Database migration requirements
  - API interface definitions
  - Developer testing strategy
- Implementation tasks must be atomic, testable, and traceable to the specification's success criteria.

## Governance

- Amendments to this Constitution require a version bump and documented change record.
- Amendments must list the rationale and all affected artifacts or standards.
- Amendments shall be reviewed and approved before being applied to planning and implementation stages.
- This Constitution is invoked automatically by Spec-Kit Plus tooling (e.g., /sp.constitution, /sp.plan, /sp.tasks). It is referenced by CLI commands and compliance checks at each development phase to ensure that development artifacts, code generation, tests, and implementation remain aligned with the approved project principles.

**Version**: 1.2.0 | **Ratified**: 2025-01-01 | **Last Amended**: 2025-12-31