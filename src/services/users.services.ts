import bcrypt from 'bcryptjs';
import Users from '../models/users.model';
import { IUsers } from '../models/users.model';
import * as handleErrors from '../utils/handleErrors';

export const signup = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  avatar?: string
): Promise<IUsers> => {
  // TODO
  // [ ] check if user (email) already exists

  // Salting for hashing password
  const saltRounds = 10;

  const users = new Users({
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

  await users.save();
  //   // TODO
  //   // [ ] Update error handling

  return users;
};

export const login = async (email: string, password: string) => {
  await Users.findOne({ email: email }).then((user) => {
    // User not found from email given
    if (!user) {
      // error 400
      throw new handleErrors.BadRequest('Email is not found.');
    }
    // Password doesn't match user
    if (!bcrypt.compareSync(password, user.password))
      throw new handleErrors.BadRequest(
        'Password is incorrect. Please try again.'
      );

    // Email & password match
    const loginPayload = {
      email,
      password,
    };
  });
};
