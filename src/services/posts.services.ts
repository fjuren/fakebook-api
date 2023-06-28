import Posts from '../models/posts.model';
import { IPosts } from '../models/posts.model';
import Users from '../models/users.model';
import * as handleErrors from '../utils/handleErrors';

export const findAllPosts = async () => {
  // const postsOld = await Posts.find().sort({ postCreated: 'desc' }).limit(3);

  const posts = await Posts.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
  ])
    .limit(10)
    .exec()
    .then((result) => {
      return result;
    });

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

  await posts.save();
  //   // TODO
  //   // [ ] Update error handling
  //      [ ] Create user and run them through to successfully save data to db

  console.log(posts);

  return posts;
};
