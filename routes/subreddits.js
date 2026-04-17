// src/routes/subreddits.js
// Express routes for Subreddit API

const express = require('express');
const router = express.Router();
const subredditController = require('../controllers/subredditController');

// GET /api/subreddits - Fetch all subreddits
router.get('/', subredditController.getAllSubreddits);

// POST /api/subreddits - Create a new subreddit
router.post('/', subredditController.createSubreddit);

// GET /api/subreddits/:id - Fetch a subreddit and its threads
router.get('/:id', subredditController.getSubredditById);

module.exports = router;
