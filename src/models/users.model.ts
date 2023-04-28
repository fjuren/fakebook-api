import { Schema, model, Types } from 'mongoose';

interface IUsers {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  friendRequest?: Types.ObjectId[];
  userRequests?: Types.ObjectId[];
  posts?: Types.ObjectId[];
  comments?: Types.ObjectId[];
  avatar?: string;
  accountCreated: Date;
}

const usersSchema = new Schema<IUsers>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  friendRequest: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
  ],
  userRequests: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
  ],
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Posts',
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comments',
    },
  ],
  avatar: { type: String, default: '' },
  accountCreated: { types: Date },
});

const UsersModelling = model<IUsers>('Users', usersSchema);

export default UsersModelling;
