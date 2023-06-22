import { Request, Response, NextFunction } from 'express-serve-static-core';
import { validationResult } from 'express-validator';
import * as usersServices from '../services/users.services';
import * as handleErrors from '../utils/handleErrors';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errorCode: 400,
        errors: errors.array(),
      });
      return handleErrors.BadRequestError; // 400
    }

    const { firstName, lastName, email, password, avatar } = req.body;

    const { user, jwtToken } = await usersServices.signup(
      firstName,
      lastName,
      email,
      password,
      avatar
    );

    res.status(200);
    res.json({
      success: true,
      message: 'Account created successfully',
      user,
      token: jwtToken,
    });
  } catch (e: any) {
    if (e instanceof handleErrors.ConflictError) {
      res
        .status(e.statusCode)
        .json({ statusCode: e.statusCode, error: e.message });
    } else {
      res.status(500).json({ statusCode: 500, error: 'Server error' });
    }
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errorCode: 400,
        errors: errors.array(),
      });
      return handleErrors.BadRequestError; // 400
    }

    const { email, password } = req.body;

    const { user, jwtToken } = await usersServices.login(email, password);

    res.status(200);
    res.json({
      success: true,
      message: 'User successfully logged in',
      user: user,
      token: jwtToken, // TODO [ ] add this to localstorage when ready
    });
  } catch (e: any) {
    if (e instanceof handleErrors.BadRequestError) {
      res
        .status(e.statusCode)
        .json({ statusCode: e.statusCode, error: e.message });
    } else {
      res.status(500).json({ statusCode: 500, error: 'Server error' });
    }
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err: any) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
