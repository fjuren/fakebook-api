import { Response, Request, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import * as postsServices from '../services/posts.services';
import { IPosts, ErrorResponse } from '../models/posts.model';
import * as handleErrors from '../utils/handleErrors';

export const getPosts = async (
  req: Request,
  res: Response<IPosts[] | ErrorResponse>,
  next: NextFunction
) => {
  try {
    const posts = await postsServices.findAllPosts();
    res.status(200).json(posts);
  } catch (e: any) {
    console.log(e);

    const errorResponse: ErrorResponse = {
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

export const createPost = async (
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

    const { content, image } = req.body;

    // TODO
    // [ ] Update with real user once user modules are added
    const user = 'testuser';

    const newPost = await postsServices.createPost(content, image, user);

    res.status(200).json(newPost);
  } catch (err: any) {
    res.status(500).json(err.message);
    console.log(err);
  }
};
