import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash?: string;
  googleId?: string;
  username: string;
  avatar?: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false },
    googleId: { type: String, unique: true, sparse: true },
    username: { type: String, required: true, trim: true },
    avatar: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

userSchema.pre('validate', function (next) {
  if (this.isNew && !this.passwordHash && !this.googleId) {
    next(new Error('User must have password or Google account'));
  } else {
    next();
  }
});

export const User = mongoose.model<IUser>('User', userSchema);
