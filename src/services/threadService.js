import Thread from '../models/Thread.js';
import User from '../models/User.js';
import Subreddit from '../models/Subreddit.js';

// Fetch all threads with filtering, sorting, and pagination
export const fetchAllThreads = async ({ search, subredditId, authorId, sortBy = 'newest', page = 1, limit = 20 }) => {
    const query = {};
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } }
        ];
    }
    if (subredditId) query.subreddit = subredditId;
    if (authorId) query.author = authorId;

    let sort = { createdAt: -1 };
    if (sortBy === 'oldest') sort = { createdAt: 1 };
    else if (sortBy === 'mostUpvoted') sort = { voteCount: -1 };
    else if (sortBy === 'mostDownvoted') sort = { downvotes: -1 };
    else if (sortBy === 'trending') sort = { voteCount: -1, createdAt: -1 };

    const skip = (page - 1) * limit;
    const threads = await Thread.find(query)
        .populate('author', 'name email')
        .populate('subreddit', 'name description')
        .sort(sort)
        .skip(skip)
        .limit(limit);
    const total = await Thread.countDocuments(query);
    return { threads, pagination: { page, limit, total } };
};

// Fetch a single thread by ID
export const fetchThreadById = async (threadId) => {
    return Thread.findById(threadId)
        .populate('author', 'name email')
        .populate('subreddit', 'name description');
};

// Create a new thread
export const createThread = async ({ title, content, authorId, subredditId }) => {
    const thread = new Thread({
        title,
        content,
        author: authorId,
        subreddit: subredditId,
    });
    const created = await thread.save();
    return Thread.findById(created._id)
        .populate('author', 'name email')
        .populate('subreddit', 'name description');
};

// Update an existing thread
export const updateThreadById = async (threadId, { title, content, authorId, subredditId }) => {
    return Thread.findByIdAndUpdate(
        threadId,
        {
            title,
            content,
            author: authorId,
            subreddit: subredditId,
        },
        { new: true, runValidators: true }
    )
        .populate('author', 'name email')
        .populate('subreddit', 'name description');
};

// Delete a thread
export const deleteThreadById = async (threadId) => {
    return Thread.findByIdAndDelete(threadId);
};

export const userExists = async (userId) => {
    const user = await User.findById(userId);
    return !!user;
};

export const subredditExists = async (subredditId) => {
    const subreddit = await Subreddit.findById(subredditId);
    return !!subreddit;
};