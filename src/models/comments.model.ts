import { Schema, model, Types } from 'mongoose';

export interface IComments {
  content: string;
  commentLikes?: Types.ObjectId[];
  user: Types.ObjectId;
  commentCreated: Date; // note: This is stored in an ISO 8601 format and is UTC
}

const commentsSchema = new Schema<IComments>({
  content: { type: String, required: true },
  commentLikes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
  ],
  user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  commentCreated: { type: Date, default: Date.now, required: true },
});

const CommentsModelling = model<IComments>('Comments', commentsSchema);

export default CommentsModelling;
