import passport from 'passport';
import express from 'express';
import * as commentValidation from '../utils/comments.validation';
import * as commentController from '../controllers/comments.controller';

const checkAuthToken = passport.authenticate('jwt', { session: false });
const router = express.Router();

// post comments
router.post(
  '/create_comment',
  checkAuthToken,
  commentValidation.newCommentValidation,
  commentController.createComment
);

// get comments
// router.get()

export default router;
