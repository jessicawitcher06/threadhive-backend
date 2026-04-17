// src/services/subredditService.js
// Handles all direct database interactions for Subreddit

const Subreddit = require('../models/Subreddit');
const Thread = require('../models/Thread');

// Fetch all subreddits
async function getAllSubreddits() {
    return await Subreddit.find().populate('author');
}

// Create a new subreddit
async function createSubreddit({ name, description, author }) {
    const subreddit = new Subreddit({ name, description, author });
    return await subreddit.save();
}

// Fetch a subreddit by ID, including its threads
async function getSubredditById(id) {
    const subreddit = await Subreddit.findById(id).populate('author');
    if (!subreddit) return null;
    const threads = await Thread.find({ subreddit: id }).populate('author');
    return { ...subreddit.toObject(), threads };
}

module.exports = {
    getAllSubreddits,
    createSubreddit,
    getSubredditById,
};
