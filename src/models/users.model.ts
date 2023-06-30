// import { Schema, model, Types } from 'mongoose';
import * as mongoose from 'mongoose';

export interface IUsers extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  friendRequest?: mongoose.Types.ObjectId[];
  userRequests?: mongoose.Types.ObjectId[];
  posts?: mongoose.Types.ObjectId[];
  comments?: mongoose.Types.ObjectId[];
  avatar?: string;
  accountCreated: Date;
}

const usersSchema = new mongoose.Schema<IUsers>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  friendRequest: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
  ],
  userRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Posts',
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comments',
    },
  ],
  avatar: { type: String, default: '' },
  accountCreated: { type: Date }, // note: This is stored in an ISO 8601 format and is UTC
});

const Users = mongoose.model<IUsers>('Users', usersSchema);

export default Users;
