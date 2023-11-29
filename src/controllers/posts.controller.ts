require('dotenv').config();
import { Response, Request, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import * as postsServices from '../services/posts.services';
import { IPosts, ErrorResponse } from '../models/posts.model';
import * as handleErrors from '../utils/handleErrors';

import { decodeToken } from '../utils/decodeToken';
import { IUsers } from '../models/users.model';
import Users from '../models/users.model';
import Jwt, { JwtPayload } from 'jsonwebtoken';

import mime from 'mime';

export const getPosts = async (
  req: Request,
  res: Response<IPosts[] | ErrorResponse>,
  next: NextFunction
) => {
  // for infinite scrolling
  const { page = 1, limit = 10 } = req.query;

  try {
    const posts = await postsServices.findAllPosts(page, limit);
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

export const getUserProfilePosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await Users.findById(req.params.userID);

    if (!user) {
      // TODO: update error handling. See getPosts above for example
      return res.status(404).json({ message: 'user not found' });
    }
    const userId = user?._id;

    const userProfilePosts = await postsServices.findUserPosts(userId);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Post created',
      userProfilePosts,
    });
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

    const token = req.header('Authorization')?.replace('Bearer ', ''); // just extracting the token and removing Bearer
    const decodedToken = decodeToken(token);

    const userTokenID = decodedToken.user._id;
    const user = await Users.findById(userTokenID);

    if (!user) {
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
    const userId = user?._id;

    const newPost = await postsServices.createPost(
      content,
      fileURL,
      userId,
      user
    );

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

export const likePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    // just extracting the token and removing Bearer
    const decodedToken = decodeToken(token);

    const userTokenID = decodedToken.user._id;
    const user = await Users.findById(userTokenID);

    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }
    if (!req.body.postID) {
      return res.status(404).json({ message: 'post not found' });
    }
    const userId = user._id;
    const postID = req.body.postID;

    const handlePostLike = await postsServices.handleLike(userId, postID);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Post like updated',
      handlePostLike,
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
