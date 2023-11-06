require('dotenv').config();
import { Response, Request, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import * as commentsServices from '../services/comments.services';
import * as handleErrors from '../utils/handleErrors';
import { decodeToken } from '../utils/decodeToken';
import Users from '../models/users.model';
import Posts from '../models/posts.model';

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

    const token = req.header('Authorization')?.replace('Bearer ', ''); // just extracting the token and removing Bearer
    const decodedToken = decodeToken(token);

    const userTokenID = decodedToken.user._id;
    const user = await Users.findById(userTokenID);

    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }

    const { content, postID } = req.body;
    const userId = user?._id;
    // const postObjID = await Posts.findById(postID);

    const newComment = await commentsServices.createComment(
      content,
      userId,
      user,
      postID
    );

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        'comment created. Applicable User & Post documents updated with new comment',
      newComment,
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
        msg: e.message,
        success: false,
        name: 'Internal server error',
        statusCode: 500,
        error: 'Server error',
      });
    }
  }
};
