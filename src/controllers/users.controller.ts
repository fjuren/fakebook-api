require('dotenv').config();
import { Request, Response, NextFunction } from 'express-serve-static-core';
import { validationResult } from 'express-validator';
import * as usersServices from '../services/users.services';
import * as handleErrors from '../utils/handleErrors';

import Users from '../models/users.model';
import Jwt, { JwtPayload } from 'jsonwebtoken';

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

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    // get user information from jwt token
    const secret = process.env.JWT_SECRET as string;
    const token = req.header('Authorization')?.replace('Bearer ', ''); // just extracting the token and removing Bearer

    if (!token) {
      throw new Error();
    }

    // decode token with secret, extract user id and find user from db
    const decodedToken = Jwt.verify(token, secret) as JwtPayload;
    const userIDFromToken = decodedToken.user._id;
    // const userID = await Users.findById(userTokenID);
    const user = usersServices
      .findUser(userIDFromToken)
      .then((userProfileData) => {
        res.status(200).json(userProfileData);
      });

    // if (!userID) {
    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }

    // const userMongoID = userID?._id;
  } catch (e: any) {
    console.log(e);

    const errorResponse = {
      // TODO create interface for user ErrorResponse. See posts.ctonroller
      success: e.success,
      name: e.name,
      statusCode: e.statusCode,
      error: e.message,
    };

    // TODO needs testing
    if (e instanceof handleErrors.UnauthorizedError) {
      res.status(e.statusCode).json(errorResponse);
    }
    res.status(500).json({
      success: false,
      name: 'Internal server error',
      statusCode: 500,
      error: 'Server error',
    });
  }
};
