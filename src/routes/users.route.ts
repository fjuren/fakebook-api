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

// User logout
router.post('/logout', usersController.logout);

// User information
router.get('/profile', checkAuthToken, usersController.getUserProfile);

export default router;
