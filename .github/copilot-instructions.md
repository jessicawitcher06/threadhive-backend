# ThreadHive Backend Copilot Instructions

## Project Scope

This repository contains the ThreadHive backend API built with Node.js, Express, and MongoDB (Mongoose).
Primary API domains currently implemented:
- Auth (`/api/auth`)
- Threads (`/api/threads`)
- Subreddits (`/api/subreddits`)

## Architecture Rules

- Keep layered architecture:
  - `src/routes`: HTTP route wiring and middleware composition
  - `src/controllers`: request validation, response shaping, status codes
  - `src/services`: business logic + database operations
  - `src/middleware`: auth and error handling
  - `src/models`: Mongoose schemas and model registration
- Avoid moving data-access logic into controllers.
- Reuse utilities like `createAppError` for operational errors.

## API Response Contract

For success:
```json
{
  "success": true,
  "message": "Optional message",
  "data": {}
}
```

For errors:
```json
{
  "success": false,
  "message": "Error message"
}
```

Use the global error middleware for consistent error output.

## Security Expectations

- Do not trust client-provided author identifiers for protected writes.
- Use authenticated user identity (`req.user`) for ownership-sensitive operations.
- Keep auth-protected write routes behind `authHandler`.
- Validate ObjectId inputs before DB operations.
- Keep sensitive config in environment variables only.

## Auth Conventions

- JWT bearer tokens are expected in `Authorization: Bearer <token>`.
- `JWT_SECRET` must be present for auth functionality.
- Auth endpoints:
  - `POST /api/auth/register`
  - `POST /api/auth/login`

## Testing Conventions

- Use Vitest + Supertest for integration tests.
- Prefer endpoint-focused tests in `tests/integration`.
- Cover:
  - success paths
  - auth failures
  - validation failures
  - authorization/ownership checks
- Keep tests deterministic and isolated.

## Change Discipline

- Keep changes minimal and scoped to the requested task.
- Preserve existing endpoint behavior unless the request is explicitly about changing behavior.
- When adding new routes/features, update:
  - route registration in `src/app.js`
  - tests in `tests/integration`
  - docs in `README.md`
