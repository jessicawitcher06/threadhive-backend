import {
  fetchAllSubreddits,
  createNewSubreddit,
  fetchSubredditWithThreads,
} from "../services/subredditService.js";

export const getAllSubreddits = async (req, res, next) => {
  try {
    const subreddits = await fetchAllSubreddits();
    res.status(200).json({
      success: true,
      message: "Fetched all subreddits",
      data: { subreddits },
    });
  } catch (err) {
    next(err);
  }
};

export const createSubreddit = async (req, res, next) => {
  const { name, description, author: bodyAuthor } = req.body;
  const requesterId = req.user?.id ? String(req.user.id) : null;

  if (!name || !description) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }
  if (!requesterId) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }
  if (bodyAuthor && String(bodyAuthor) !== requesterId) {
    return res.status(403).json({ success: false, message: "Cannot create subreddit for another user" });
  }

  try {
    const subreddit = await createNewSubreddit(name, description, requesterId);
    res.status(201).json({
      success: true,
      message: "Subreddit created",
      data: { subreddit },
    });
  } catch (err) {
    next(err);
  }
};

export const getSubredditWithThreads = async (req, res, next) => {
  const { id } = req.params;
  try {
    const subreddit = await fetchSubredditWithThreads(id);
    res.status(200).json({
      success: true,
      message: "Fetched subreddit",
      data: { subreddit },
    });
  } catch (err) {
    next(err);
  }
};
