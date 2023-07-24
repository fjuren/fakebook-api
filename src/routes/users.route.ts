import express from 'express';
import * as usersController from '../controllers/users.controller';
import * as usersValidation from '../utils/users.validation';
import passport from 'passport';

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

// Facebook user authentication
router.post(
  '/login/facebook',
  passport.authenticate('facebook-token'), // { session: false }
  usersController.facebookLogin
);

router.get('');

// User logout
router.post('/logout', usersController.logout);

export default router;
