import express from 'express';
import * as postsController from '../controllers/posts.controller';

const router = express.Router();

router.get('/timeline', postsController.getPosts);

// Create
router.post('/create_post', postsController.createPost);

// Delete
router.delete('/:postId');

export default router;
