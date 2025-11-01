import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js"; // adjust path to your User model

export const signup = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        if (!userName || !email || !password)
            return res.status(400).json({ message: "All fields are required" });

        // check for existing user by email or username
        const existing = await User.findOne({ $or: [{ email }, { userName }] });
        if (existing)
            return res
                .status(409)
                .json({ message: "User with given email or username already exists" });

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create user
        const user = await User.create({
            userName,
            email,
            password: hashedPassword,
        });

        // generate JWT (keep secret in env vars)
        const token = jwt.sign(
            { id: user._id, userName: user.userName, email: user.email },
            process.env.JWT_SECRET || "change_this_secret",
            { expiresIn: "7d" }
        );

        // remove password before sending response
        const userResponse = user.toObject ? user.toObject() : { ...user };
        delete userResponse.password;

        return res.status(201).json({ success: true, user: userResponse, token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "All fields are required" });

    // Find user by email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, userName: user.userName, email: user.email },
      process.env.JWT_SECRET || "change_this_secret",
      { expiresIn: "7d" }
    );

    // Remove password before sending response
    const userResponse = user.toObject ? user.toObject() : { ...user };
    delete userResponse.password;

    return res.status(200).json({ success: true, user: userResponse, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
