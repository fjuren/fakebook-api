import express from 'express';
import * as usersController from '../controllers/users.controller';
import * as usersValidation from '../utils/users.validation';
import passport from 'passport';
import rateLimit from 'express-rate-limit';
import { upload } from '../config/multer';
import { check } from 'express-validator';

const checkAuthToken = passport.authenticate('jwt', { session: false });
const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 10, // 10 requests per 15 mins
});

// Regular user authentication (signup)
router.post(
  '/signup',
  usersValidation.userSignupValidation,
  usersController.signup
);

// Regular user authentication (login)
router.post(
  '/login',
  usersValidation.userLoginValidation,
  usersController.login
);

// Get user profile
router.get('/profile/:userID', checkAuthToken, usersController.getUserProfile);

// Post new profile pic
router.post(
  '/update_profile_pic/:authedUserID',
  checkAuthToken,
  limiter,
  upload.single('file'),
  usersValidation.profilePicUploadValidation,
  usersController.updateProfilePic
);

// Post friend request. This allows a user to request a friend
router.post(
  '/friend_request/:userID',
  checkAuthToken,
  usersController.postFriendRequest
);

// Post an answer/response to a friend request
router.post(
  '/friend_request_answer/',
  checkAuthToken,
  usersController.postFriendRequestAnswer
);

router.post('/unfriend/:userID', checkAuthToken, usersController.unFriend);

router.get('/friends/', checkAuthToken, usersController.getAllFriendRequests);

// User logout
router.post('/logout', usersController.logout);

export default router;
