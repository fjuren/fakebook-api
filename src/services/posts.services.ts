import { JwtPayload } from 'jsonwebtoken';
import Posts from '../models/posts.model';
import { IPosts } from '../models/posts.model';
import Users from '../models/users.model';
import { IUsers } from '../models/users.model';

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
    { $unwind: '$user' },
    {
      $project: {
        'user.password': 0,
        'user.accountCreated': 0,
        'user.email': 0,
        'user.posts': 0,
        'user.userRequests': 0,
        'user.friendRequests': 0,
      },
    },
    {
      $lookup: {
        from: 'comments',
        let: { commentIds: '$comments' },
        pipeline: [
          { $match: { $expr: { $in: ['$_id', '$$commentIds'] } } },
          {
            $lookup: {
              from: 'users',
              localField: 'user',
              foreignField: '_id',
              as: 'user',
            },
          },
          { $unwind: '$user' },
          {
            $project: {
              content: 1,
              user: { _id: 1, username: 1 },
              commentCreated: 1,
            },
          },
          { $sort: { commentCreated: -1 } },
        ],
        as: 'comments',
      },
    },
    { $sort: { postCreated: -1 } },
    { $limit: 5 },
  ])
    // .limit(10)
    .exec()
    .then((result) => {
      return result;
    });
  return posts;
};

export const findUserPosts = async (userID: any) => {
  try {
    const userProfilePosts = await Users.findById(userID).populate({
      path: 'posts',
      options: {
        sort: { postCreated: -1 },
      },
      populate: [
        {
          path: 'user',
          model: 'Users',
        },
        { path: 'comments', model: 'Comments' },
      ],
    });
    if (userProfilePosts) {
      const postData = {
        posts: userProfilePosts.posts as [],
      };
      return postData;
    } else {
      // no post data
    }
  } catch (err) {
    throw err;
  }
};

export const createPost = async (
  content: string,
  fileURL: string | null,
  userId: string | JwtPayload,
  user: any
): Promise<IPosts> => {
  const post = new Posts({
    content: content,
    image: fileURL,
    likes: [],
    user: userId,
    comments: [],
    postCreated: Date.now(),
  });

  // Add post to user document under user.posts
  await Users.findByIdAndUpdate(
    user,
    { $push: { posts: post } },
    { new: true }
  );

  await post.save();

  //   // TODO
  //   // [ ] Update error handling
  return post;
};
