import { Schema, model, models, Types } from 'mongoose';

export interface ILanguage {
  _id: Types.ObjectId;
  name: string;
  slug: string;
}

const LanguageSchema = new Schema<ILanguage>(
  {
    name: { type: String, required: true, unique: true, index: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true }
  },
  { timestamps: true }
);

export default models.Language || model<ILanguage>('Language', LanguageSchema);