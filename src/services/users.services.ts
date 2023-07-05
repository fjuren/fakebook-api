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
  // TODO
  // [ ] check if user (email) already exists
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
    { user }, // TODO REFACTOR CODE; check if this change broke something
    process.env.JWT_SECRET as string,
    {
      expiresIn: '14d',
    }
  );

  return { user: user, jwtToken: 'Bearer ' + jwtToken };
};

export const login = async (email: string, password: string) => {
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
    return user;
  });

  const jwtToken = jwt.sign({ email }, process.env.JWT_SECRET as string, {
    expiresIn: '14d',
  });

  return {
    user,
    jwtToken: 'Bearer ' + jwtToken,
  };
};
