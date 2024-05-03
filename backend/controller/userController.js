import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import mongoose from "mongoose";

const getUserProfile = async (req, res) => {
  // We will fetch user profile either with username or userId
  const { username } = req.params;
  try {
    let user;
    if (mongoose.Types.ObjectId.isValid(username)) {
      user = await User.findOne({ _id: username })
        .select("-password")
        .select("-updatedAt");
    } else {
      user = await User.findOne({ username: username })
        .select("-password")
        .select("-updatedAt");
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(`Error Occured : ${error.message}`);
  }
};

const signupUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(500).json({ error: "User Already Exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      username,
      email,
      password: hashPassword,
    });
    await newUser.save();

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid User Data" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(`Error Occured : ${error.message}`);
  }
};

const loginUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCheck = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordCheck) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(`Error Occured : ${error.message}`);
  }
};

const logoutUser = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "User Logout Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(`Error Occured : ${error.message}`);
  }
};

const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You cannot follow/unfollow yourself" });
    }
    if (!userToModify || !currentUser) {
      return res.status(400).json({ error: "User cannot found" });
    }
    const isFollowed = currentUser.following.includes(id);
    if (isFollowed) {
      //unfollow user
      //modify currentuser id to following array and modify userToModify from follower array
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      await User.findByIdAndUpdate(id, { $pull: { following: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { followers: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      //follow user
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      await User.findByIdAndUpdate(id, { $push: { following: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { followers: id } });
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(`Error Occured : ${error.message}`);
  }
};

const updateUser = async (req, res) => {
  const { name, username, email, password, bio } = req.body;
  let { profilePic } = req.body;
  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (req.params.id !== userId.toString()) {
      return res
        .status(400)
        .json({ error: "You cannot update other user profile" });
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      user.password = hashPassword;
    }

    if (req.file) {
      profilePic = req.file.filename;
    }

    user.name = name || user.name;
    user.username = username || user.username;
    user.email = email || user.email;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    user = await user.save();
    user.password = null;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(`Update Error Occured : ${error.message}`);
  }
};

export {
  signupUser,
  loginUser,
  logoutUser,
  followUnfollowUser,
  updateUser,
  getUserProfile,
};
