import Subreddit from "../models/Subreddit.js";
import Thread from "../models/Thread.js";
import { createAppError } from "../utils/createAppError.js";

export const fetchAllSubreddits = async () => {
  return await Subreddit.find().populate("author");
};

export const createNewSubreddit = async (name, description, author) => {
  const existingSubreddit = await Subreddit.findOne({ name });
  if (existingSubreddit) {
    throw createAppError("Subreddit name already exists", 409);
  }

  const subreddit = new Subreddit({ name, description, author });
  const createdSubreddit = await subreddit.save();

  if (!createdSubreddit) {
    throw createAppError("Failed to create subreddit", 500);
  }

  return createdSubreddit;
};

export const fetchSubredditWithThreads = async (id) => {
  const subreddit = await Subreddit.findById(id).populate("author");
  if (!subreddit) {
    throw createAppError("Subreddit not found", 404);
  }

  const threads = await Thread.find({ subreddit: id }).populate("author");
  return { ...subreddit.toObject(), threads };
};
