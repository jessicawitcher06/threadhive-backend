import {
  fetchAllSubreddits,
  createNewSubreddit,
  fetchSubredditWithThreads,
} from "../services/subredditService.js";

export const getAllSubreddits = async (req, res) => {
  try {
    const subreddits = await fetchAllSubreddits();
    res.status(200).json({
      success: true,
      message: "Fetched all subreddits",
      data: { subreddits },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createSubreddit = async (req, res) => {
  const { name, description, author } = req.body;
  if (!name || !description || !author) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }
  try {
    const existing = await fetchAllSubreddits();
    if (existing.some((s) => s.name === name)) {
      return res.status(409).json({ success: false, message: "Subreddit name already exists" });
    }
    const subreddit = await createNewSubreddit(name, description, author);
    res.status(201).json({
      success: true,
      message: "Subreddit created",
      data: { subreddit },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSubredditWithThreads = async (req, res) => {
  const { id } = req.params;
  try {
    const subreddit = await fetchSubredditWithThreads(id);
    if (!subreddit) {
      return res.status(404).json({ success: false, message: "Subreddit not found" });
    }
    res.status(200).json({
      success: true,
      message: "Fetched subreddit",
      data: { subreddit },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
