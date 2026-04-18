# ThreadHive Thread API – Detailed Implementation Plan

## Overview
This plan breaks down the implementation of the Thread API (Part 2) for the ThreadHive backend, based on the architectural design and requirements.

---

## Phase 1: GET Endpoints

### 1. GET /api/threads
- Fetch all threads
- Support filtering: search, subredditId, authorId
- Support sorting: newest, oldest, mostUpvoted, mostDownvoted, trending
- Support pagination: page, limit
- Populate author and subreddit fields

### 2. GET /api/threads/:threadId
- Fetch a single thread by ID
- Populate author and subreddit fields
- Return 404 if not found

### 3. GET /api/subreddits/:subredditId/threads
- Fetch all threads in a subreddit
- Support sorting, pagination

### 4. GET /api/users/:userId/threads
- Fetch all threads by a user
- Support sorting, pagination

---

## Phase 2: POST, PUT, PATCH Endpoints

### 5. POST /api/threads
- Create a new thread
- Validate required fields: title, content, authorId, subredditId
- Ensure author and subreddit exist
- Set upvotes, downvotes, voteCount to 0
- Return 201 with created thread

### 6. PUT /api/threads/:threadId
- Full update of a thread
- Validate ownership (if required)
- Return updated thread

### 7. PATCH /api/threads/:threadId
- Partial update (title/content)
- Validate ownership (if required)
- Return updated thread

### 8. POST /api/subreddits/:subredditId/threads
- Create thread in a subreddit (optional, can reuse POST /api/threads)

---

## Phase 3: DELETE & Voting Endpoints

### 9. DELETE /api/threads/:threadId
- Delete a thread
- Validate ownership (if required)
- Return success message

### 10. POST /api/threads/:threadId/upvote
- Add an upvote
- Accept userId (or use auth context)
- Update vote counts

### 11. POST /api/threads/:threadId/downvote
- Add a downvote
- Accept userId (or use auth context)
- Update vote counts

### 12. DELETE /api/threads/:threadId/vote
- Remove a user's vote
- Update vote counts

---

## General Implementation Notes
- Use standard response envelope: `{ success: true/false, data/message/error }`
- Handle errors: 400 (bad request), 404 (not found), 403 (forbidden), 500 (server error)
- Always populate author and subreddit fields in responses
- Validate existence of referenced documents (author, subreddit)
- Use Mongoose for all DB operations
- Organize code: services/, controllers/, routes/

---

## Next Steps
1. Scaffold services/threadService.js, controllers/threadController.js, routes/threads.js
2. Implement endpoints phase by phase, testing after each phase
3. Commit and push after each phase

---
*Prepared for ThreadHive Part 2 implementation, April 17, 2026.*
