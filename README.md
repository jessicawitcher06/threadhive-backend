# ThreadHive Backend

ThreadHive Backend is a Node.js + Express + MongoDB API for a Reddit-style discussion platform. It supports community (subreddit) management, thread creation and discovery, user registration/login, JWT-based auth, and protected write operations.

## Features

- User authentication with JWT
- Register and login endpoints
- Subreddit creation and listing
- Thread CRUD with filtering, sorting, and pagination
- Protected write endpoints (auth required)
- Centralized error handling with consistent response shape
- Security middleware (Helmet + rate limiting)
- Integration tests with Vitest + Supertest

## Tech Stack

- Node.js
- Express 5
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- Security middleware (`helmet`, `express-rate-limit`)
- Testing: Vitest, Supertest, mongodb-memory-server

## Architecture

The backend follows a layered structure:

- `src/routes` for endpoint definitions and middleware wiring
- `src/controllers` for request validation and response shaping
- `src/services` for business and data logic
- `src/models` for Mongoose schemas
- `src/middleware` for auth and global error handling
- `src/utils` for shared helpers

## Project Structure

```text
src/
  app.js
  controllers/
    authController.js
    subredditController.js
    threadController.js
  middleware/
    authHandler.js
    errorHandler.js
  models/
    Subreddit.js
    Thread.js
    User.js
  routes/
    auth.js
    subreddits.js
    threads.js
  services/
    authService.js
    subredditService.js
    threadService.js
  utils/
    createAppError.js
scripts/
  run-tests.js
tests/
  integration/
    auth-and-protection.test.js
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas URI or local MongoDB instance

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root.

Required:

```env
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<strong_random_secret>
```

Optional:

```env
CORS_ORIGIN=http://localhost:5173
TEST_MONGODB_URI=<optional_separate_test_db_uri>
```

Notes:

- If `TEST_MONGODB_URI` is not set, the test runner will reuse `MONGODB_URI`.
- Use a dedicated test database in shared environments.

### Run the API

Development:

```bash
npm run dev
```

Production-style start:

```bash
npm start
```

Default server URL: `http://localhost:3000`

## Testing

Run all tests:

```bash
npm run test
```

Watch mode:

```bash
npm run test:watch
```

Current integration suite validates:

- register/login flow
- protected route rejection without token
- protected route success with token
- author spoofing protection

## API Endpoints

### Auth

| Method | Route | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login and receive JWT | No |

### Subreddits

| Method | Route | Description | Auth |
|---|---|---|---|
| GET | `/api/subreddits` | List subreddits | No |
| POST | `/api/subreddits` | Create subreddit | Yes |
| GET | `/api/subreddits/:id` | Get subreddit with threads | No |

### Threads

| Method | Route | Description | Auth |
|---|---|---|---|
| GET | `/api/threads` | List threads (search/sort/pagination) | No |
| GET | `/api/threads/:threadId` | Get thread by id | No |
| POST | `/api/threads` | Create thread | Yes |
| PUT | `/api/threads/:threadId` | Update owned thread | Yes |
| DELETE | `/api/threads/:threadId` | Delete owned thread | Yes |

## Response Format

Success:

```json
{
  "success": true,
  "message": "Optional message",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Security Notes

- JWT bearer auth on protected writes
- Ownership checks enforced server-side
- Client-provided author spoofing blocked
- Helmet security headers enabled
- Global and auth-specific rate limiting enabled

## License

ISC
