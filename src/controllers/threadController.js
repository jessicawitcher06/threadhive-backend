import {
    fetchAllThreads,
    fetchThreadById,
    createThread,
    updateThreadById,
    deleteThreadById,
    userExists,
    subredditExists,
} from '../services/threadService.js';

// GET /api/threads
export const getAllThreads = async (req, res) => {
    try {
        const { search, subredditId, authorId, sortBy, page = 1, limit = 20 } = req.query;
        const result = await fetchAllThreads({ search, subredditId, authorId, sortBy, page: Number(page), limit: Number(limit) });
        res.status(200).json({ success: true, data: result.threads, pagination: result.pagination });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// GET /api/threads/:threadId
export const getThreadById = async (req, res) => {
    try {
        const thread = await fetchThreadById(req.params.threadId);
        if (!thread) return res.status(404).json({ success: false, error: 'Thread not found' });
        res.status(200).json({ success: true, data: thread });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// POST /api/threads
export const createThreadController = async (req, res) => {
    const { title, content, authorId, subredditId } = req.body;
    if (!title || !content || !authorId || !subredditId) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        const [authorFound, subredditFound] = await Promise.all([
            userExists(authorId),
            subredditExists(subredditId),
        ]);

        if (!authorFound) {
            return res.status(404).json({ success: false, message: 'Author not found' });
        }
        if (!subredditFound) {
            return res.status(404).json({ success: false, message: 'Subreddit not found' });
        }

        const thread = await createThread({ title, content, authorId, subredditId });
        return res.status(201).json({
            success: true,
            message: 'Thread created',
            data: { thread },
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// PUT /api/threads/:threadId
export const updateThreadController = async (req, res) => {
    const { threadId } = req.params;
    const { title, content, authorId, subredditId } = req.body;
    if (!title || !content || !authorId || !subredditId) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        const [authorFound, subredditFound] = await Promise.all([
            userExists(authorId),
            subredditExists(subredditId),
        ]);

        if (!authorFound) {
            return res.status(404).json({ success: false, message: 'Author not found' });
        }
        if (!subredditFound) {
            return res.status(404).json({ success: false, message: 'Subreddit not found' });
        }

        const updatedThread = await updateThreadById(threadId, { title, content, authorId, subredditId });
        if (!updatedThread) {
            return res.status(404).json({ success: false, message: 'Thread not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Thread updated',
            data: { thread: updatedThread },
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// DELETE /api/threads/:threadId
export const deleteThreadController = async (req, res) => {
    const { threadId } = req.params;
    try {
        const deletedThread = await deleteThreadById(threadId);
        if (!deletedThread) {
            return res.status(404).json({ success: false, message: 'Thread not found' });
        }
        return res.status(200).json({
            success: true,
            message: 'Thread deleted successfully',
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};