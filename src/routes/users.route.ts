import express from 'express';
import * as usersController from '../controllers/users.controller';
// import * as usersValidation from '../utils/users.validation';

// TODO
// [ ] Authentication middleware

const router = express.Router();

router.post('/signup', usersController.signup);

export default router;
