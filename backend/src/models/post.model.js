import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String }, // Text content (optional)
    image: { type: String }, // Image URL or path (optional)
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who liked
    comments: [commentSchema], // Comments array
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
