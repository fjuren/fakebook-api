import { Response, Request, NextFunction } from 'express';
import * as postsServies from '../services/posts.services';
import { IPosts } from '../models/posts.model';

export const getPosts = async (
  req: Request,
  res: Response<IPosts[]>,
  next: NextFunction
) => {
  try {
    const posts = await postsServies.findAllPosts();
    res.status(200).json(posts);
  } catch (e: any) {
    res.status(500).send(e.message);
  }
};
