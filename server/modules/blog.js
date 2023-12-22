import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  likedBy: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  dislikedBy: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
});

export default mongoose.model("Blog", blogSchema);
