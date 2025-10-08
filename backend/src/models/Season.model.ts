import { Schema, model, models, Types } from 'mongoose';

export interface ISeason {
  _id: Types.ObjectId;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

const SeasonSchema = new Schema<ISeason>(
  {
    name: { type: String, required: true, unique: true, index: true, trim: true },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    isActive: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

export default models.Season || model<ISeason>('Season', SeasonSchema);