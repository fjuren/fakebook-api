import Posts from '../models/posts.model';
import { IPosts } from '../models/posts.model';
import * as handleErrors from '../utils/handleErrors';

export const findAllPosts = async () => {
  const posts = await Posts.find().sort({ postCreated: 'desc' }).limit(10);
  return posts;
};

export const createPost = async (
  content: string,
  image: string,
  user: string
): Promise<IPosts> => {
  const posts = new Posts({
    content: content,
    image: image,
    likes: [],
    user: user,
    comments: [],
    postCreate: Date.now,
  });

  await posts.save(function (err) {
    // TODO
    // [ ] Update error handling
    if (err) return handleErrors.BaseError;
  });

  return posts;
};
