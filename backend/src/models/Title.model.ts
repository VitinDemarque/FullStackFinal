import { Schema, model, models, Types } from 'mongoose';

export interface ITitle {
  _id: Types.ObjectId;
  name: string;
  description?: string | null;
  minLevel?: number | null;
  minXp?: number | null;
}

const TitleSchema = new Schema<ITitle>(
  {
    name: { type: String, required: true, unique: true, index: true, trim: true },
    description: { type: String, default: null },
    minLevel: { type: Number, default: null, min: 1 },
    minXp: { type: Number, default: null, min: 0 }
  },
  { timestamps: true }
);

export default models.Title || model<ITitle>('Title', TitleSchema);