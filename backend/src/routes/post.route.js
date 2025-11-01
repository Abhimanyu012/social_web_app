import { Router } from "express";
import { 
  createPost, 
  getFeed, 
  likePost, 
  commentOnPost, 
  getUserPosts, 
  verifyToken 
} from "../controllers/post.controller.js";

const router = Router();

// All post routes require authentication
router.use(verifyToken);

// Create a new post
router.post("/", createPost);

// Get all posts (public feed)
router.get("/feed", getFeed);

// Like/unlike a post
router.put("/:postId/like", likePost);

// Comment on a post
router.post("/:postId/comment", commentOnPost);

// Get posts by user
router.get("/user/:userId", getUserPosts);

export default router;
