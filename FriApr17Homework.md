# FriApr17Homework.md

## 1. Postman Testing Plan for Subreddit API (Part 1)

### Endpoints to Test

#### 1. GET /api/subreddits
- **Purpose:** Fetch all subreddits
- **Request:**
  - Method: GET
  - URL: http://localhost:3000/api/subreddits
- **Expected Response:**
  - Status: 200
  - Body: `{ success: true, message: 'Fetched all subreddits', data: { subreddits: [...] } }`

#### 2. POST /api/subreddits
- **Purpose:** Create a new subreddit
- **Request:**
  - Method: POST
  - URL: http://localhost:3000/api/subreddits
  - Body (JSON):
    ```json
    {
      "name": "react",
      "description": "Discussions about React",
      "author": "<user_id>"
    }
    ```
  - Replace `<user_id>` with a valid user ObjectId from your database.
- **Expected Responses:**
  - 201: Subreddit created
  - 400: Missing required fields
  - 409: Subreddit name already exists

#### 3. GET /api/subreddits/:id
- **Purpose:** Fetch a subreddit and its threads
- **Request:**
  - Method: GET
  - URL: http://localhost:3000/api/subreddits/<subreddit_id>
  - Replace `<subreddit_id>` with a valid subreddit ObjectId.
- **Expected Responses:**
  - 200: Subreddit and threads returned
  - 404: Subreddit not found

---

## 2. Implementation Plan for Part 2 (Thread API)

### Phase 1: GET Endpoints
- **Endpoints:**
  - GET /api/threads (fetch all threads)
  - GET /api/threads/:id (fetch a single thread)
- **Files to Update:**
  - services/threadService.js
  - controllers/threadController.js
  - routes/threads.js
- **Key Considerations:**
  - Pagination, filtering, and population of related fields (author, subreddit)

### Phase 2: POST and PUT Endpoints
- **Endpoints:**
  - POST /api/threads (create a new thread)
  - PUT /api/threads/:id (update a thread)
- **Files to Update:**
  - services/threadService.js
  - controllers/threadController.js
  - routes/threads.js
- **Key Considerations:**
  - Validation, error handling, and response format

### Phase 3: DELETE Endpoint
- **Endpoint:**
  - DELETE /api/threads/:id (delete a thread)
- **Files to Update:**
  - services/threadService.js
  - controllers/threadController.js
  - routes/threads.js
- **Key Considerations:**
  - Ensure thread is deleted and handle related data if necessary

---

## 3. Next Steps
- Run and verify all Part 1 tests in Postman.
- Commit and push any fixes or improvements.
- Begin implementing Part 2, following the phased plan above.
- Test each Thread API endpoint after implementation.

---
*Prepared for Friday, April 17 Homework Session.*
