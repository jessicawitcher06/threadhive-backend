# ThreadHive – Thread API Design (Claude Version)

## 1. Data Model Analysis

### Relationships:
- **User** → has many Threads (via `author` field)
- **Subreddit** → has many Threads (via `subreddit` field)
- **Thread** belongs to User and Subreddit
- Thread has voting data: `upvotes`, `downvotes`, `voteCount`

### Thread Schema:
```
{
  _id: ObjectId,
  title: String (required),
  content: String (required),
  author: ObjectId (ref: User),
  subreddit: ObjectId (ref: Subreddit),
  upvotes: Number,
  downvotes: Number,
  voteCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 2. API Endpoint Design

### Core Thread Operations

| Method | Endpoint | Purpose | Query Parameters |
|--------|----------|---------|------------------|
| GET | `/threads` | Fetch all threads with filtering | `search`, `subredditId`, `authorId`, `sortBy`, `page`, `limit` |
| POST | `/threads` | Create a new thread | — |
| GET | `/threads/:threadId` | Fetch single thread by ID | — |
| PUT | `/threads/:threadId` | Update thread (full update) | — |
| PATCH | `/threads/:threadId` | Partial thread update | — |
| DELETE | `/threads/:threadId` | Delete a thread | — |

### Nested Resource Endpoints

| Method | Endpoint | Purpose | Query Parameters |
|--------|----------|---------|------------------|
| GET | `/subreddits/:subredditId/threads` | Get all threads in a subreddit | `sortBy`, `page`, `limit` |
| POST | `/subreddits/:subredditId/threads` | Create thread in a subreddit | — |
| GET | `/users/:userId/threads` | Get all threads created by a user | `sortBy`, `page`, `limit` |

### Voting Endpoints

| Method | Endpoint | Purpose | Body |
|--------|----------|---------|------|
| POST | `/threads/:threadId/upvote` | Add an upvote | `{ userId }` or via auth context |
| POST | `/threads/:threadId/downvote` | Add a downvote | `{ userId }` or via auth context |
| DELETE | `/threads/:threadId/vote` | Remove a vote | — |

---

## 3. Request/Response Specifications

### GET /threads (List all threads)
**Query Parameters:**
- `search` – Search in title/content (string)
- `subredditId` – Filter by subreddit (ObjectId)
- `authorId` – Filter by author (ObjectId)
- `sortBy` – Sort option: `newest`, `oldest`, `mostUpvoted`, `mostDownvoted`, `trending` (default: newest)
- `page` – Pagination page (default: 1)
- `limit` – Results per page (default: 20, max: 100)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "...",
      "content": "...",
      "author": { "_id": "...", "name": "..." },
      "subreddit": { "_id": "...", "name": "..." },
      "upvotes": 10,
      "downvotes": 2,
      "voteCount": 8,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

---

### POST /threads (Create thread)
**Request Body:**
```json
{
  "title": "My Thread Title",
  "content": "Thread content here...",
  "authorId": "user_id_here",
  "subredditId": "subreddit_id_here"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "My Thread Title",
    "content": "Thread content here...",
    "author": { "_id": "...", "name": "..." },
    "subreddit": { "_id": "...", "name": "..." },
    "upvotes": 0,
    "downvotes": 0,
    "voteCount": 0,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### GET /threads/:threadId (Get single thread)
**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "...",
    "content": "...",
    "author": { "_id": "...", "name": "...", "email": "..." },
    "subreddit": { "_id": "...", "name": "...", "description": "..." },
    "upvotes": 10,
    "downvotes": 2,
    "voteCount": 8,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### PATCH /threads/:threadId (Update thread)
**Request Body (at least one field required):**
```json
{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

**Success Response (200):** Returns updated thread object

---

### DELETE /threads/:threadId (Delete thread)
**Success Response (200):**
```json
{
  "success": true,
  "message": "Thread deleted successfully"
}
```

---

### POST /threads/:threadId/upvote (Add upvote)
**Request Body:**
```json
{
  "userId": "user_id_here"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "upvotes": 11,
    "downvotes": 2,
    "voteCount": 9
  }
}
```

---

## 4. Architectural Decision: Hybrid Approach

### Architecture Choice:
**Hybrid: Flat + Nested Resources**

### Rationale:

**Option A: Pure Flat Architecture**
- All queries via `/threads?subredditId=X&authorId=Y`
- ✅ Simpler, consistent
- ❌ Less discoverable, doesn't reflect hierarchy

**Option B: Pure Nested Architecture**
- Subreddit threads: `/subreddits/:subredditId/threads`
- User threads: `/users/:userId/threads`
- ✅ Clear relationships, RESTful
- ❌ Redundant, harder to query across subreddits/users

**Option C: Hybrid (RECOMMENDED)**
- Primary endpoint: `/threads` with query filters
- Secondary nested: `/subreddits/:subredditId/threads`, `/users/:userId/threads`
- ✅ Flexible, discoverable, supports both patterns
- ✅ Clients choose based on their needs

---

## 5. Error Handling

| Status | Scenario | Response |
|--------|----------|----------|
| 400 | Missing required fields | `{ "success": false, "error": "Missing title" }` |
| 404 | Thread not found | `{ "success": false, "error": "Thread not found" }` |
| 403 | Unauthorized action (e.g., delete other's thread) | `{ "success": false, "error": "Not authorized" }` |
| 500 | Server error | `{ "success": false, "error": "Internal server error" }` |

---

## 6. Implementation Notes

- **Population:** Always populate `author` and `subreddit` with necessary fields
- **Validation:** Ensure `authorId` and `subredditId` exist before creating thread
- **Pagination:** Default to page 1, limit 20, max limit 100
- **Sorting:** Support multiple sort options for flexibility
- **Vote Tracking:** Consider tracking which user voted to prevent duplicate votes (future enhancement)
- **Timestamps:** Auto-managed by Mongoose (`createdAt`, `updatedAt`)
