import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IWishlistItem extends Document {
  userId: Types.ObjectId;
  cardId: string;
  addedAt: Date;
}

const wishlistItemSchema = new Schema<IWishlistItem>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    cardId: { type: String, required: true },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

wishlistItemSchema.index({ userId: 1, cardId: 1 }, { unique: true });

export const WishlistItem = mongoose.model<IWishlistItem>('WishlistItem', wishlistItemSchema);
