require('dotenv').config();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Users from '../models/users.model';
import { IUsers } from '../models/users.model';
import * as handleErrors from '../utils/handleErrors';

interface SafeUser {
  _id: string;
  firebase_id?: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  accountCreated: Date;
}

export const signup = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  avatar?: string
) => {
  var safeUser = {} as SafeUser;
  const userExists = await Users.findOne({ email: email }).then((user) => {
    if (user) {
      // error 409 - data conflict
      throw new handleErrors.ConflictError('Email already exists');
    }
  });

  // Salting for hashing password
  const saltRounds = 10;

  const user: IUsers = new Users({
    firstName,
    lastName,
    email,
    password: bcrypt.hashSync(password, saltRounds),
    friends: [],
    friendRequest: [],
    userRequests: [],
    posts: [],
    comments: [],
    avatar,
    accountCreated: new Date(),
  });

  await user.save();

  const jwtToken: string = jwt.sign(
    // { email },
    { user }, // TODO REFACTOR CODE; check if this change broke something (Changed this to access ._id on createPost in posts.controller.ts file)
    process.env.JWT_SECRET as string,
    {
      expiresIn: '14d',
    }
  );
  // extract only safe information that may be called to client side; not sensitive information
  safeUser = {
    _id: user._id, // safe to use ID since I'm using a token for authorization
    firebase_id: user._id.toString(), // Convert ObjectId to string because firebase UID requirement is to be a string only
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    avatar: user.avatar,
    accountCreated: user.accountCreated,
  };
  return { safeUser: safeUser, jwtToken: 'Bearer ' + jwtToken };
};

export const login = async (email: string, password: string) => {
  var safeUser = {} as SafeUser;
  const user = await Users.findOne({ email: email }).then((user) => {
    // User not found from email given
    if (!user) {
      // error 400
      throw new handleErrors.BadRequestError('Email is not found.');
    }
    // Password doesn't match user
    if (!bcrypt.compareSync(password, user.password))
      throw new handleErrors.BadRequestError(
        'Password is incorrect. Please try again.'
      );
    // extract only safe information that may be called to client side; not sensitive information
    safeUser = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      accountCreated: user.accountCreated,
    };
    return safeUser;
  });

  const jwtToken = jwt.sign({ user }, process.env.JWT_SECRET as string, {
    // replaced 'email' with 'user'. Same as signup. This was causing an error decoding jwt in posts.controller on createPost
    expiresIn: '14d',
  });

  return {
    safeUser,
    jwtToken: 'Bearer ' + jwtToken,
  };
};

export const findUser = async (userIDFromToken: string) => {
  try {
    const user = await Users.findById(userIDFromToken).populate({
      path: 'friends',
      select: 'avatar firstName lastName',
    });
    if (user) {
      const profileData = {
        _id: user._id as string,
        firstName: user.firstName as string,
        lastName: user.lastName as string,
        friends: user.friends as [],
        friendRequest: user.friendRequest as [],
        userRequests: user.userRequests as [],
        // posts: user.posts as [],
        avatar: user.avatar as string,
      };
      return profileData;
    } else {
      // no user data
    }
  } catch (err) {
    throw err;
  }
};

export const updateProfilePicture = async (
  fileURL: string,
  authedUserID: string
) => {
  try {
    if (fileURL) {
      await Users.findByIdAndUpdate(
        authedUserID,
        {
          $set: {
            avatar: fileURL,
          },
        },
        { new: true }
      );
      return { fileURL, message: 'Profile picture updated' };
    } else {
      console.log('need to validate');
    }
  } catch (err) {
    throw err;
  }
};

export const addFriendRequest = async (
  friendRequesteeID: string,
  friendRequestorID: string
) => {
  try {
    // Find the friendRequestee user by ID
    const friendRequestee: IUsers | any = await Users.findById(
      friendRequesteeID
    );

    if (!friendRequestee || friendRequestee == undefined) {
      throw new Error('Friend requestee not found');
    } else {
      // Add the friendRequestor to the friendRequestee's friendRequest array
      friendRequestee.friendRequest.push(friendRequestorID);
    }

    const friendRequesteeUpdated = await friendRequestee.save();
    return friendRequesteeUpdated;
  } catch (err) {
    throw err;
  }
};

export const acceptOrDeclineRequest = async (
  requestAnswer: boolean,
  userID: string,
  authedUserID: string
) => {
  try {
    // if true, move id of requesting friend from friendRequest to friend
    if (requestAnswer) {
      // Find the friendRequestee user by ID
      await Users.findByIdAndUpdate(
        authedUserID,
        {
          $pull: { friendRequest: userID }, // remove userID from friend request
          $addToSet: { friends: userID }, // adds userID to friends list (fyi if it's already there, it won't add a duplicate value)
        },
        { new: true }
      );

      // If a single friend request is accepted, both the friend requestor and requestee become friends. So add the the requestee to the requestor's friend likst as well
      await Users.findByIdAndUpdate(
        userID,
        {
          $pull: { friendRequest: authedUserID },
          $addToSet: { friends: authedUserID },
        },
        { new: true }
      );

      return 'Friend request accepted. Both friends are now added to their respected friends list';
    } else {
      await Users.findByIdAndUpdate(
        authedUserID,
        { $pull: { friendRequest: userID } },
        { new: true }
      );
      return 'Friend request declined and deleted';
    }
  } catch (err) {
    throw err;
  }
};

export const unFriend = async (
  unFriendRequest: boolean,
  friendToBeRemovedID: string,
  authedUserID: string
) => {
  try {
    if (unFriendRequest) {
      // remove the friend from the authedUser's friend's list
      await Users.findByIdAndUpdate(
        authedUserID,
        {
          $pull: { friends: friendToBeRemovedID }, // remove friend from authedUser request
        },
        { new: true }
      );

      // Also remove the authedUser from the
      await Users.findByIdAndUpdate(
        friendToBeRemovedID,
        {
          $pull: { friends: authedUserID }, // remove authedUser from receiving friend list as well
        },
        { new: true }
      );
      return `${friendToBeRemovedID} removed from ${authedUserID}'s friends list`;
    }
  } catch (err) {
    throw err;
  }
};

export const userAllFriendRequests = async (
  userOrAuthUserID: string,
  authedUserID: string
) => {
  try {
    // Determine which user friends list is being requested and whether it's 1) the same as the current authed user, 2) some other user and 3) if 2 is true, whether the two users are 'friends'
    // rules:
    // 1. a user accessing their own 'friends' page should see everything
    // 2. a user accessing their friend's 'friends' page should only show who the user is friend's with
    // 3. a user accessing a random user's 'friend's page should not see any of this information. They should ONLY be able to requst being friends with the user but from the profile page (completely separate page to where this api call is coming from)

    const userFriendsRequestsAndFriends = await Users.findById(userOrAuthUserID)
      .select('friendRequest friends')
      .populate({
        path: 'friendRequest',
        select: 'firstName lastName avatar friends',
        populate: {
          path: 'friends',
          select: 'firstName lastName avatar friends',
        },
      })
      .populate({
        path: 'friends',
        select: 'firstName lastName avatar friends',
        populate: {
          path: 'friends',
          select: 'firstName lastName avatar friends',
        },
      })
      .exec();

    const allUserFriendData = userFriendsRequestsAndFriends;

    const userFriends = await Users.findById(userOrAuthUserID)
      .select('friends')
      .populate({
        path: 'friends',
        select: 'firstName lastName avatar friends',
        populate: {
          path: 'friends',
          select: 'firstName lastName avatar friends',
        },
      })
      .exec();

    const userFriendsOnly = userFriends;

    // if true, rule 1 applies
    if (userOrAuthUserID == authedUserID) {
      return allUserFriendData;
    }
    // if ture, rule 2 applies
    if (
      userOrAuthUserID != authedUserID &&
      allUserFriendData?.friends?.some((friendID) =>
        friendID.equals(authedUserID)
      )
    ) {
      return userFriendsOnly;
      // if true, rule 3 applies
    } else {
      return false;
    }

    // const friendRequesteeUpdated = await friendRequestee.save();
    // return friendRequesteeUpdated;
  } catch (err) {
    throw err;
  }
};
