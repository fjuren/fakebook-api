import { JwtPayload } from 'jsonwebtoken';
import Posts from '../models/posts.model';
import { IPosts } from '../models/posts.model';
import Users from '../models/users.model';
import { IUsers } from '../models/users.model';

export const findAllPosts = async (page: any, limit: any) => {
  const skip = (page - 1) * limit; // calculates how many docs to skip (supports infinite scrolling functionality)

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
        'user.friendRequest': 0,
        'user.comments': 0,
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
              user: { _id: 1, firstName: 1, lastName: 1, avatar: 1 },
              commentCreated: 1,
            },
          },
          { $sort: { commentCreated: -1 } },
        ],
        as: 'comments',
      },
    },
    { $sort: { postCreated: -1 } },
    { $skip: skip }, // added for infinite scrolling functionality
    { $limit: limit },
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
          select:
            '-accountCreated -email -friendRequest -friends -password -posts -userRequests -comments',
        },
        {
          path: 'comments',
          model: 'Comments',
          populate: [
            {
              path: 'user',
              model: 'Users',
              select:
                '-accountCreated -email -friendRequest -friends -password -posts -userRequests -comments',
            },
          ],
        },
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

export const handleLike = async (userId: any, postID: string) => {
  try {
    // Find the post by ID
    const post = await Posts.findById(postID);
    if (!post) {
      throw {
        message:
          'There was an error related to the post or the post does not exist',
      };
    }
    // console.log('post.likes before:', post.likes);
    // console.log('userId:', userId);
    // check if the user previously liked the post
    const isLiked = post.likes?.some((like) => like.equals(userId));
    // console.log('isLiked:', isLiked);
    if (isLiked) {
      post.likes = post.likes?.filter((like) => !like.equals(userId)) || [];
    } else {
      post.likes?.push(userId);
    }
    // console.log('post.likes after: ', post.likes);
    await post.save();

    return post;
  } catch (err) {
    throw err;
  }
};
