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
      // I decided not to use template errors from handleErrors.ts for validation errors using express-validator library
      res.status(400).json({
        success: false,
        statusCode: 400,
        errors: errors.array(),
      });
    }

    const { firstName, lastName, email, password, avatar } = req.body;

    const { user, jwtToken } = await usersServices.signup(
      firstName,
      lastName,
      email,
      password,
      avatar
    );

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Account created successfully',
      user,
      token: jwtToken,
    });
  } catch (e: any) {
    if (e instanceof handleErrors.ConflictError) {
      res.status(e.statusCode).json({
        success: e.success,
        name: e.name,
        statusCode: e.statusCode,
        error: e.message,
      });
    } else {
      res.status(500).json({
        success: false,
        name: 'Internal server error',
        statusCode: 500,
        error: 'Server error',
      });
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
        statusCode: 400,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    const { user, jwtToken } = await usersServices.login(email, password);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'User successfully logged in',
      user: user,
      token: jwtToken,
    });
  } catch (e: any) {
    if (e instanceof handleErrors.BadRequestError) {
      res.status(e.statusCode).json({
        success: e.success,
        name: e.name,
        statusCode: e.statusCode,
        error: e.message,
      });
    } else {
      res.status(500).json({
        success: false,
        name: 'Internal server error',
        statusCode: 500,
        error: 'Server error',
      });
    }
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  // TODO I need to check if there are any cleanup tasks I can do
  res.json({
    success: true,
    statusCode: 200,
    message: 'User successfully logged out',
  });
};
