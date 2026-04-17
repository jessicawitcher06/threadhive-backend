// src/controllers/subredditController.js
// Handles HTTP requests for Subreddit API

const subredditService = require('../services/subredditService');

// Fetch all subreddits
async function getAllSubreddits(req, res) {
    try {
        const subreddits = await subredditService.getAllSubreddits();
        res.status(200).json({
            success: true,
            message: 'Fetched all subreddits',
            data: { subreddits }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

// Create a new subreddit
async function createSubreddit(req, res) {
    const { name, description, author } = req.body;
    if (!name || !description || !author) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    try {
        // Check for duplicate subreddit name
        const existing = await subredditService.getAllSubreddits();
        if (existing.some(s => s.name === name)) {
            return res.status(409).json({ success: false, message: 'Subreddit name already exists' });
        }
        const subreddit = await subredditService.createSubreddit({ name, description, author });
        res.status(201).json({
            success: true,
            message: 'Subreddit created',
            data: { subreddit }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

// Fetch a subreddit by ID (with threads)
async function getSubredditById(req, res) {
    const { id } = req.params;
    try {
        const subreddit = await subredditService.getSubredditById(id);
        if (!subreddit) {
            return res.status(404).json({ success: false, message: 'Subreddit not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Fetched subreddit',
            data: { subreddit }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

module.exports = {
    getAllSubreddits,
    createSubreddit,
    getSubredditById,
};
