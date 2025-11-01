import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "change_this_secret");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    
    // At least one of content or image should be provided
    if (!content && !image) {
      return res.status(400).json({ message: "Either content or image is required" });
    }

    const post = await Post.create({
      user: req.user.id,
      content: content || null,
      image: image || null,
    });

    // Populate user information
    await post.populate("user", "userName");
    
    res.status(201).json({ message: "Post created successfully", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all posts (feed)
export const getFeed = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "userName")
      .populate("likes", "userName")
      .populate("comments.user", "userName")
      .sort({ createdAt: -1 });

    // Transform posts to include username arrays for likes and comments
    const transformedPosts = posts.map(post => ({
      ...post.toObject(),
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      likedUsers: post.likes.map(like => like.userName),
      commentedUsers: post.comments.map(comment => ({
        userName: comment.user.userName,
        text: comment.text,
        createdAt: comment.createdAt
      }))
    }));

    res.status(200).json({ posts: transformedPosts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Like a post
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user has already liked the post
    const isLiked = post.likes.includes(req.user.id);
    
    if (isLiked) {
      // Unlike the post
      post.likes = post.likes.filter(like => like.toString() !== req.user.id);
      await post.save();
      return res.status(200).json({ message: "Post unliked", post });
    } else {
      // Like the post
      post.likes.push(req.user.id);
      await post.save();
      return res.status(200).json({ message: "Post liked", post });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Comment on a post
export const commentOnPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    
    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Add comment
    post.comments.push({
      user: req.user.id,
      text: text.trim()
    });

    await post.save();
    
    // Populate the new comment with user info
    await post.populate("comments.user", "userName");
    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json({ 
      message: "Comment added successfully", 
      comment: {
        userName: newComment.user.userName,
        text: newComment.text,
        createdAt: newComment.createdAt
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's posts
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const posts = await Post.find({ user: userId })
      .populate("user", "userName")
      .populate("likes", "userName")
      .populate("comments.user", "userName")
      .sort({ createdAt: -1 });

    const transformedPosts = posts.map(post => ({
      ...post.toObject(),
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      likedUsers: post.likes.map(like => like.userName),
      commentedUsers: post.comments.map(comment => ({
        userName: comment.user.userName,
        text: comment.text,
        createdAt: comment.createdAt
      }))
    }));

    res.status(200).json({ posts: transformedPosts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
