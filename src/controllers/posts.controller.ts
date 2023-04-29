import { Response, Request, NextFunction } from 'express';
import PostsModelling from '../models/posts.model';

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await PostsModelling.find()
      .sort({ postCreated: 'desc' })
      .limit(10);

    res.status(200).json(posts);

    return posts;
  } catch (e: any) {
    res.status(500).send(e.message);
  }
};
