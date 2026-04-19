import express from 'express';
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
router.post('/', createThreadController);

// GET /api/threads/:threadId
router.get('/:threadId', getThreadById);

// PUT /api/threads/:threadId
router.put('/:threadId', updateThreadController);

// DELETE /api/threads/:threadId
router.delete('/:threadId', deleteThreadController);

export default router;