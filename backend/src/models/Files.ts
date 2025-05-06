import mongoose, { Document, Schema } from 'mongoose';

export interface IFile extends Document {
  filename: string;
  size: number;
  cid: string;
  contentType: string;
  uploadDate: Date;
  owner: mongoose.Types.ObjectId;
}

const FileSchema: Schema = new Schema({
  filename: { type: String, required: true },
  size: { type: Number, required: true },
  cid: { type: String, required: true, unique: true },
  contentType: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.model<IFile>('File', FileSchema);