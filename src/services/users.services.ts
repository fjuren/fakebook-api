import Users from '../models/users.model';
import { IUsers } from '../models/users.model';

export const signup = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  avatar?: string
): Promise<IUsers> => {
  const users = new Users({
    firstName,
    lastName,
    email,
    password,
    friendRequest: [],
    userRequests: [],
    posts: [],
    comments: [],
    avatar,
    accountCreated: Date,
  });

  await users.save();
  //   // TODO
  //   // [ ] Update error handling
  //      [ ] Create user and run them through to successfully save data to db

  return users;
};
