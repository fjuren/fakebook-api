import express from 'express';
import * as usersController from '../controllers/users.controller';
import * as usersValidation from '../utils/users.validation';
import passport from 'passport';

const router = express.Router();

router.post(
  '/signup',
  usersValidation.userSignupValidation,
  usersController.signup
);

router.post(
  '/login',
  usersValidation.userLoginValidation,
  // passport.authenticate('jwt', { session: false }),
  usersController.login
);

router.post('/logout', usersController.logout);

export default router;
