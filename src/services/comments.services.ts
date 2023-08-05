import { JwtPayload } from 'jsonwebtoken';
import CommentsModelling from '../models/comments.model';
import Users from '../models/users.model';
import Posts from '../models/posts.model';
import { IComments } from '../models/comments.model';

export const createComment = async (
  content: string,
  user: string | JwtPayload,
  userID: any,
  postID: any
) => {
  try {
    const comment = new CommentsModelling({
      content: content,
      userLikes: [],
      user: user,
      commentCreated: Date.now(),
    });

    // Saving the new comment!
    await comment.save();

    // Add comment to post document under post.comments
    await Posts.findByIdAndUpdate(
      postID,
      { $push: { comments: comment._id } },
      { new: true }
    );

    // Add comment to user document under user.comments
    await Users.findByIdAndUpdate(
      userID,
      { $push: { comments: comment._id } },
      { new: true }
    );

    return comment;
  } catch (e) {
    console.log(e);
    throw e;
  }

  //   // TODO
  //   // [ ] Update error handling
};
