import mongoose from 'mongoose';
import {
    fetchAllThreads,
    fetchThreadById,
    fetchThreadOwnerById,
    createThread,
    updateThreadById,
    deleteThreadById,
    userExists,
    subredditExists,
} from '../services/threadService.js';

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const getRequesterId = (req) => {
    if (!req.user) return null;
    if (req.user.id) return String(req.user.id);
    if (req.user._id) return String(req.user._id);
    return null;
};

// GET /api/threads
export const getAllThreads = async (req, res, next) => {
    try {
        const { search, subredditId, authorId, sortBy } = req.query;
        const rawPage = Number(req.query.page ?? 1);
        const rawLimit = Number(req.query.limit ?? 20);
        const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
        const limit = Number.isInteger(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 100) : 20;
        if (subredditId && !isValidObjectId(subredditId)) {
            return res.status(400).json({ success: false, message: 'Invalid subredditId' });
        }
        if (authorId && !isValidObjectId(authorId)) {
            return res.status(400).json({ success: false, message: 'Invalid authorId' });
        }
        const result = await fetchAllThreads({ search, subredditId, authorId, sortBy, page, limit });
        res.status(200).json({ success: true, data: result.threads, pagination: result.pagination });
    } catch (err) {
        next(err);
    }
};

// GET /api/threads/:threadId
export const getThreadById = async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.threadId)) {
            return res.status(400).json({ success: false, message: 'Invalid thread ID' });
        }
        const thread = await fetchThreadById(req.params.threadId);
        res.status(200).json({ success: true, data: thread });
    } catch (err) {
        next(err);
    }
};

// POST /api/threads
export const createThreadController = async (req, res, next) => {
    const { title, content, authorId: bodyAuthorId, subredditId } = req.body;
    const requesterId = getRequesterId(req);

    if (!title || !content || !subredditId) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    if (!requesterId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    if (bodyAuthorId && String(bodyAuthorId) !== requesterId) {
        return res.status(403).json({ success: false, message: 'Cannot create thread for another user' });
    }
    if (!isValidObjectId(subredditId)) {
        return res.status(400).json({ success: false, message: 'Invalid subredditId' });
    }

    const authorId = requesterId;

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
        return next(err);
    }
};

// PUT /api/threads/:threadId
export const updateThreadController = async (req, res, next) => {
    const { threadId } = req.params;
    const { title, content, authorId: bodyAuthorId, subredditId } = req.body;
    const requesterId = getRequesterId(req);

    if (!isValidObjectId(threadId)) {
        return res.status(400).json({ success: false, message: 'Invalid thread ID' });
    }
    if (!title || !content || !subredditId) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    if (!requesterId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    if (bodyAuthorId && String(bodyAuthorId) !== requesterId) {
        return res.status(403).json({ success: false, message: 'Cannot update thread as another user' });
    }
    if (!isValidObjectId(subredditId)) {
        return res.status(400).json({ success: false, message: 'Invalid subredditId' });
    }

    const authorId = requesterId;

    try {
        const threadOwner = await fetchThreadOwnerById(threadId);

        if (requesterId && String(threadOwner.author) !== requesterId) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this thread' });
        }

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

        return res.status(200).json({
            success: true,
            message: 'Thread updated',
            data: { thread: updatedThread },
        });
    } catch (err) {
        return next(err);
    }
};

// DELETE /api/threads/:threadId
export const deleteThreadController = async (req, res, next) => {
    const { threadId } = req.params;
    const requesterId = getRequesterId(req);

    if (!isValidObjectId(threadId)) {
        return res.status(400).json({ success: false, message: 'Invalid thread ID' });
    }
    if (!requesterId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    try {
        const threadOwner = await fetchThreadOwnerById(threadId);

        if (requesterId && String(threadOwner.author) !== requesterId) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this thread' });
        }

        await deleteThreadById(threadId);
        return res.status(200).json({
            success: true,
            message: 'Thread deleted successfully',
        });
    } catch (err) {
        return next(err);
    }
};