require('dotenv').config();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Users from '../models/users.model';
import { IUsers } from '../models/users.model';
import * as handleErrors from '../utils/handleErrors';

export const signup = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  avatar?: string
) => {
  var safeUser = {};
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
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    avatar: user.avatar,
    accountCreated: user.accountCreated,
  };

  return { safeUser: safeUser, jwtToken: 'Bearer ' + jwtToken };
};

export const login = async (email: string, password: string) => {
  var safeUser = {};
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
      path: 'posts',
      options: {
        sort: { postCreated: -1 },
      },
    });
    if (user) {
      const profileData = {
        firstName: user.firstName as string,
        lastName: user.lastName as string,
        friends: user.friends as [],
        friendRequest: user.friendRequest as [],
        userRequests: user.userRequests as [],
        posts: user.posts as [],
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
