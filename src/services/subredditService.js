import Subreddit from "../models/Subreddit.js";
import Thread from "../models/Thread.js";

export const fetchAllSubreddits = async () => {
  return await Subreddit.find().populate("author");
};

export const createNewSubreddit = async (name, description, author) => {
  const subreddit = new Subreddit({ name, description, author });
  return await subreddit.save();
};

export const fetchSubredditWithThreads = async (id) => {
  const subreddit = await Subreddit.findById(id).populate("author");
  if (!subreddit) return null;
  const threads = await Thread.find({ subreddit: id }).populate("author");
  return { ...subreddit.toObject(), threads };
};
