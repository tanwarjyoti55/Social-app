import Post from "../model/postModel.js";
import User from "../model/userModel.js";

const createPost = async (req, res) => {
  try {
    const { postedBy, text, img } = req.body;

    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ message: "postedBy and text are required" });
    }
    const user = await User.findById(postedBy);
    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Unauthorized create post" });
    }
    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ message: "Text length should be less than maxlength" });
    }
    const post = new Post({ postedBy, text, img });
    await post.save();
    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json(error.message);
    console.log(`Error Occurred : ${error.message}`);
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json(error.message);
    console.log(`Error Occurred : ${error.message}`);
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(400).json({ message: "Unauthorized delete post" });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post Deleted Successfully" });
  } catch (error) {
    res.status(500).json(error.message);
    console.log(`Error Occurred : ${error.message}`);
  }
};

const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLikedPost = await post.likes.includes(userId);
    if (isLikedPost) {
      //unlike the post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post Unliked successfully" });
    } else {
      //like the post
      post.likes.push(userId);
      await post.save();
      res.status(200).json({ message: "Post Liked successfully" });
    }
  } catch (error) {
    res.status(500).json(error.message);
    console.log(`Error Occurred : ${error.message}`);
  }
};

const replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    if (!text) {
      return res.status(400).json({ message: "Text field is required" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const reply = { text, userId, userProfilePic, username };
    post.replies.push(reply);
    await post.save();
    res.status(200).json({ message: "Reply on Post", post });
  } catch (error) {
    res.status(500).json(error.message);
    console.log(`Error Occurred : ${error.message}`);
  }
};

export { createPost, getPost, deletePost, likeUnlikePost, replyToPost };
