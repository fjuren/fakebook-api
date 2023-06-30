import { Schema, model, Types } from 'mongoose';

export interface IPosts {
  content: string;
  image?: string;
  likes?: Types.ObjectId[];
  user: Types.ObjectId;
  comments?: Types.ObjectId[];
  postCreated: Date; // note: This is stored in an ISO 8601 format and is UTC
  errorResponse?: ErrorResponse;
}

export interface ErrorResponse {
  success: boolean;
  name: string;
  statusCode: number;
  error: string;
}

const postsSchema = new Schema<IPosts>({
  content: { type: String, required: true },
  image: { type: String, default: '' },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
  ],
  user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
  ],
  postCreated: { type: Date, default: Date.now, required: true },
});

const Posts = model<IPosts>('Posts', postsSchema);

export default Posts;
