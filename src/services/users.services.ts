import { hashSync } from 'bcryptjs';
import Users from '../models/users.model';
import { IUsers } from '../models/users.model';

export const signup = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  avatar?: string
): Promise<IUsers> => {
  // Salting for hashing password
  const saltRounds = 10;

  const users = new Users({
    firstName,
    lastName,
    email,
    password: hashSync(password, saltRounds),
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
