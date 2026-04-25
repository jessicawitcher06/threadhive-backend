import express from 'express';
import authHandler from '../middleware/authHandler.js';
import {
	getAllThreads,
	getThreadById,
	createThreadController,
	updateThreadController,
	deleteThreadController,
} from '../controllers/threadController.js';

const router = express.Router();

// GET /api/threads
router.get('/', getAllThreads);

// POST /api/threads
router.post('/', authHandler, createThreadController);

// GET /api/threads/:threadId
router.get('/:threadId', getThreadById);

// PUT /api/threads/:threadId
router.put('/:threadId', authHandler, updateThreadController);

// DELETE /api/threads/:threadId
router.delete('/:threadId', authHandler, deleteThreadController);

export default router;