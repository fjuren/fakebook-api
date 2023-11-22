import express from 'express';
import * as usersController from '../controllers/users.controller';
import * as usersValidation from '../utils/users.validation';
import passport from 'passport';

const checkAuthToken = passport.authenticate('jwt', { session: false });
const router = express.Router();

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

// Post friend request. This allows a user to request a friend
router.post(
  '/friend_request/:userID',
  checkAuthToken,
  usersController.postFriendRequest
);

router.get('/friends/', checkAuthToken, usersController.getAllFriendRequests);

// User logout
router.post('/logout', usersController.logout);

export default router;
