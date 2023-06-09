import express from 'express';
import * as postsController from '../controllers/posts.controller';
import * as postValidation from '../utils/posts.validation';
import passport from 'passport';
import { upload } from '../config/multer';

// protects the route by checking if valid token
const checkAuthToken = passport.authenticate('jwt', { session: false });
const router = express.Router();

router.get('/timeline', checkAuthToken, postsController.getPosts);

// Create
router.post(
  '/create_post',
  checkAuthToken,
  upload.single('file'),
  postValidation.newPostValidation,
  postsController.createPost
);

// Delete
router.delete('/:postId');

export default router;
