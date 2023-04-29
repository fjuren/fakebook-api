import { Schema, model, Types } from 'mongoose';

export interface IPosts {
  content: string;
  image?: string;
  likes?: Types.ObjectId[];
  user: Types.ObjectId;
  comments?: Types.ObjectId[];
  postCreated: Date;
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

const PostsModelling = model<IPosts>('Posts', postsSchema);

export default PostsModelling;
