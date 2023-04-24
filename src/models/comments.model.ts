import { Schema, model, Types } from 'mongoose';

interface IComments {
  content: string;
  userLikes?: Types.ObjectId[];
  user: Types.ObjectId;
  commentCreated: Date;
}

const commentsSchema = new Schema<IComments>({
  content: { type: String, required: true },
  userLikes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
  ],
  user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  commentCreated: { type: Date, default: Date.now, required: true },
});

module.exports = model<IComments>('Comments', commentsSchema);
