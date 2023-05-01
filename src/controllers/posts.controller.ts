import { Response, Request, NextFunction } from 'express';
import * as postsServices from '../services/posts.services';
import { IPosts } from '../models/posts.model';
import * as handleErrors from '../utils/handleErrors';

export const getPosts = async (
  req: Request,
  res: Response<IPosts[]>,
  next: NextFunction
) => {
  try {
    const posts = await postsServices.findAllPosts();
    res.status(200).json(posts);
  } catch (e: any) {
    res.status(500).send(e.message);
  }
};

export const createPost = async (
  req: Request,
  res: Response<IPosts>,
  next: NextFunction
) => {
  try {
    const content = req.body;
    const image = req.body;
    const user = 'User placeholder';

    const newPost = await postsServices.createPost(content, image, user);
    res.json(newPost);
  } catch (e: any) {
    res.status(500).send(e.message);
  }
};
