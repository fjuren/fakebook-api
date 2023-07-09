import { JwtPayload } from 'jsonwebtoken';
import Posts from '../models/posts.model';
import { IPosts } from '../models/posts.model';

export const findAllPosts = async () => {
  const posts = await Posts.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $project: {
        user: {
          password: 0, // removes password from reponse for security of user password
        },
      },
    },
    { $unwind: '$user' },
    { $sort: { postCreated: -1 } },
    { $limit: 10 },
  ])
    // .limit(10)
    .exec()
    .then((result) => {
      return result;
    });
  return posts;
};

export const createPost = async (
  content: string,
  fileURL: string | null,
  user: string | JwtPayload
): Promise<IPosts> => {
  const posts = new Posts({
    content: content,
    image: fileURL,
    likes: [],
    user: user,
    comments: [],
    postCreate: Date.now,
  });

  await posts.save();
  //   // TODO
  //   // [ ] Update error handling
  return posts;
};
