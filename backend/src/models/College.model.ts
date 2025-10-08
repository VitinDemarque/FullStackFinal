import { Schema, model, models, Types } from 'mongoose';

export interface ICollege {
  _id: Types.ObjectId;
  name: string;
  acronym?: string | null;
  city?: string | null;
  state?: string | null;
}

const CollegeSchema = new Schema<ICollege>(
  {
    name: { type: String, required: true, unique: true, index: true, trim: true },
    acronym: { type: String, default: null, trim: true },
    city: { type: String, default: null, trim: true },
    state: { type: String, default: null, trim: true }
  },
  { timestamps: true }
);

export default models.College || model<ICollege>('College', CollegeSchema);