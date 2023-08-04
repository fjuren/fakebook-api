require('dotenv').config();
import { Response, Request, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import * as postsServices from '../services/posts.services';
// import { IComments, ErrorResponse } from '../models/comments.model';
import * as handleErrors from '../utils/handleErrors';

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        errors: errors.array(),
      });
    }

    console.log(req.body);
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
        msg: e.message,
        success: false,
        name: 'Internal server error',
        statusCode: 500,
        error: 'Server error',
      });
    }
  }
};
