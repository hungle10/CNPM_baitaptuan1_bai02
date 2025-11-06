import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: String,
    lastName: String,
    address: String,
    phonenumber: String,
    gender: {
      type: Boolean,
      default: null,
    },
    image: String,
    roleId: String,
    positionId: String,
  },
  {
    timestamps: true, // tự động tạo createdAt, updatedAt
    collection: "users", // tên collection trong MongoDB
  }
);

const User = mongoose.model("User", userSchema);
export default User;