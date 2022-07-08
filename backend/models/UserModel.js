import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema(
  {
    userID: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    isLecturer: { type: Boolean, default: false, required: true },
    isStudent: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('user', userSchema);
export default User;
