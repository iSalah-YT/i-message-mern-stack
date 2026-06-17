import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }, // this is work like a createdAt & updatedAt ok
);

const User = mongoose.model('User', userSchema);

export default User;
