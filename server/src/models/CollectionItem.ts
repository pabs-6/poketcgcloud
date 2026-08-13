import mongoose, { Document, Schema, Types } from 'mongoose';

export const CARD_CONDITIONS = ['mint', 'near_mint', 'excellent', 'good', 'played', 'poor'] as const;
export type CardCondition = (typeof CARD_CONDITIONS)[number];

export interface ICollectionItem extends Document {
  userId: Types.ObjectId;
  cardId: string;
  quantity: number;
  condition: CardCondition;
  isFoil: boolean;
  purchasePrice?: number;
  purchaseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const collectionItemSchema = new Schema<ICollectionItem>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    cardId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    condition: { type: String, enum: CARD_CONDITIONS, default: 'near_mint' },
    isFoil: { type: Boolean, default: false },
    purchasePrice: { type: Number, min: 0 },
    purchaseDate: { type: Date },
  },
  { timestamps: true }
);

collectionItemSchema.index({ userId: 1, cardId: 1 }, { unique: true });

export const CollectionItem = mongoose.model<ICollectionItem>('CollectionItem', collectionItemSchema);
