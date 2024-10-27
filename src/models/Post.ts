import { Schema, model, Document, Types } from 'mongoose';

interface IComment {
  _id:Types.ObjectId;
  user: Types.ObjectId;
  content: string;
  createdAt: Date;
}

export interface IPost extends Document {
  image: string;
  caption?: string;
  author: Types.ObjectId;
  comments?: IComment[]; 
}

const commentSchema = new Schema<IComment>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new Schema<IPost>({
  image: { type: String, required: true },
  caption: { type: String },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  comments: { type: [commentSchema], default: [] }, 
}, { timestamps: true });

export default model<IPost>('Post', postSchema);
 