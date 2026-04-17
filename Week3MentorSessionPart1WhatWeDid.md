# Week 3 Mentor Session Part 1: What We Did

## Summary
This document summarizes the steps completed for Part 1 of the ThreadHive backend assignment.

## Steps Completed

1. **Project Setup**
   - Verified and installed all dependencies using `npm install`.
   - Ensured `.env` file was configured with a valid MongoDB URI and port.

2. **Database Seeding**
   - Added required data files (`users.json`, `subreddits.json`, `threads.json`) to the `data/` directory.
   - Seeded the database using `npm run populate` and confirmed successful insertion of sample data.

3. **Subreddit API Implementation**
   - Implemented the Subreddit service in `services/subredditService.js`:
     - Fetch all subreddits
     - Create a new subreddit
     - Fetch a subreddit by ID (with threads)
   - Implemented the Subreddit controller in `controllers/subredditController.js`:
     - Standardized response format and error handling
     - Checked for duplicate subreddit names
   - Set up Subreddit routes in `routes/subreddits.js`:
     - Registered GET, POST, and GET by ID endpoints

4. **Verification**
   - Verified that all custom code was still present after adding starter code.
   - Confirmed that the database is seeded and ready for API testing.

## Next Steps
- Start the server and test the Subreddit API endpoints using Postman or curl.
- Commit and push all changes to version control.
- Proceed to Part 2 (Thread API) as per assignment instructions.

---
*Session completed on April 16, 2026.*
