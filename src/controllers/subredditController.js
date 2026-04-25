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
  const { name, description, author } = req.body;
  if (!name || !description || !author) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }
  try {
    const subreddit = await createNewSubreddit(name, description, author);
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
