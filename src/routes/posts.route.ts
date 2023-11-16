import express from 'express';
import * as postsController from '../controllers/posts.controller';
import * as postValidation from '../utils/posts.validation';
import passport from 'passport';
import { upload } from '../config/multer';
import { checkSchema } from 'express-validator';

// protects the route by checking if valid token
const checkAuthToken = passport.authenticate('jwt', { session: false });
const router = express.Router();

router.get('/timeline', checkAuthToken, postsController.getPosts);

router.get(
  '/profile/:userID',
  checkAuthToken,
  postsController.getUserProfilePosts
);

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

// Like/unlike post
router.post('/like_post', checkAuthToken, postsController.likePost);

export default router;
