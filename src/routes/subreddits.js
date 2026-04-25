import express from 'express';
import authHandler from '../middleware/authHandler.js';
import {
    getAllSubreddits,
    createSubreddit,
    getSubredditWithThreads
} from '../controllers/subredditController.js';

const router = express.Router();

router.get('/', getAllSubreddits);
router.post('/', authHandler, createSubreddit);
router.get('/:id', getSubredditWithThreads);

export default router;
