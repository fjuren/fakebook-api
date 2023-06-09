require('dotenv').config();
import { Response, Request, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import * as postsServices from '../services/posts.services';
import { IPosts, ErrorResponse } from '../models/posts.model';
import * as handleErrors from '../utils/handleErrors';

import { IUsers } from '../models/users.model';
import Users from '../models/users.model';
import Jwt, { JwtPayload } from 'jsonwebtoken';

import mime from 'mime';

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

    // get user information from jwt token
    const secret = process.env.JWT_SECRET as string;
    const token = req.header('Authorization')?.replace('Bearer ', ''); // just extracting the token and removing Bearer

    if (!token) {
      throw new Error();
    }

    // decode token with secret, extract user id and find user from db
    const decodedToken = Jwt.verify(token, secret) as JwtPayload;
    const userTokenID = decodedToken.user._id;
    const userID = await Users.findById(userTokenID);

    if (!userID) {
      return res.status(404).json({ message: 'user not found' });
    }

    const { content } = req.body; // string from post
    let fileURL = null; // null since uploading a file is optional, not required
    let filePath = '';
    let fileName = '';

    // req.file from multer and creates a url if there's an uploaded file
    if (req.file) {
      const { filename } = req.file;
      fileName = req.file.filename;
      fileURL = `http://localhost:3000/uploads/${filename}`; // TODO Change domain to dynamic when creating production environment
      filePath = `/uploads/${filename}`;
    } else {
      fileURL = ''; // schema expects a string
      filePath = '';
    }
    const user = userID?._id;

    const newPost = await postsServices.createPost(content, fileURL, user);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Post created',
      newPost,
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
