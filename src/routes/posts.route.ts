import express from 'express';
import * as postsController from '../controllers/posts.controller';
import * as postValidation from '../utils/posts.validation';
import passport from 'passport';
import { upload } from '../config/multer';
import rateLimit from 'express-rate-limit';
import { checkSchema } from 'express-validator';

// protects the route by checking if valid token
const checkAuthToken = passport.authenticate('jwt', { session: false });
const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 10, // 10 requests per 15 mins
});

// get all timeline data
router.get('/timeline', checkAuthToken, postsController.getPosts);

//  get all user posts
router.get(
  '/profile/:userID',
  checkAuthToken,
  postsController.getUserProfilePosts
);

// Create new post record
router.post(
  '/create_post',
  checkAuthToken,
  limiter,
  upload.single('file'),
  postValidation.newPostValidation,
  postsController.createPost
);

// Delete a post
router.delete('/:postId');

// Like/unlike post
router.post('/like_post', checkAuthToken, postsController.likePost);

export default router;
