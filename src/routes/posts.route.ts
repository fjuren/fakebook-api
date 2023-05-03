import express from 'express';
import * as postsController from '../controllers/posts.controller';
import * as postValidation from '../utils/posts.validation';

const router = express.Router();

router.get('/timeline', postsController.getPosts);

// Create
router.post(
  '/create_post',
  postValidation.newPostValidation,
  postsController.createPost
);

// Delete
router.delete('/:postId');

export default router;
