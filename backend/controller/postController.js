import Post from "../model/postModel.js";
import User from "../model/userModel.js";

const createPost = async (req, res) => {
  try {
    const { postedBy, text } = req.body;
    let { img } = req.body;
    if (!postedBy || !text) {
      return res.status(400).json({ error: "postedBy and text are required" });
    }
    const user = await User.findById(postedBy);
    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: "Unauthorized create post" });
    }
    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: "Text length should be less than maxlength" });
    }
    if (req.file) {
      img = req.file.filename;
    }
    const post = new Post({ postedBy, text, img });
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error.message);
    console.log(`Error Occurred : ${error.message}`);
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error.message);
    console.log(`Error Occurred : ${error.message}`);
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(400).json({ error: "Unauthorized delete post" });
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
      return res.status(404).json({ error: "Post not found" });
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

const commentLikeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;
    const replyIndex = req.body.replyIndex;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (replyIndex < 0 || replyIndex >= post.replies.length) {
      return res.status(400).json({ error: "Invalid reply index" });
    }

    const isLikedPost = await post.replies[replyIndex].commentLikes.includes(
      userId
    );
    if (isLikedPost) {
      //unlike the post
      await Post.updateOne(
        { _id: postId, "replies._id": post.replies[replyIndex]._id },
        { $pull: { "replies.$.commentLikes": userId } }
      );
      res.status(200).json({ message: "Post Unliked successfully" });
    } else {
      //like the post
      post.replies[replyIndex].commentLikes.push(userId);
      await post.save();
      res.status(200).json({ message: "Post Liked successfully" });
    }
  } catch (error) {
    res.status(500).json(error.message);
    console.log(`Error Occurred : ${error.message}`);
  }
};

const commentReplyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const replyIndex = req.body.replyIndex;
    const postId = req.params.id;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Assuming you have the index of the reply in the `replies` array
    // Assuming you pass this in the request

    // Check if the replyIndex is valid
    if (replyIndex < 0 || replyIndex >= post.replies.length) {
      return res.status(400).json({ error: "Invalid reply index" });
    }

    const reply = { text, userId, userProfilePic, username };
    post.replies[replyIndex].commentReplies.push(reply);
    await post.save();
    res.status(200).json({ message: "Reply on Post", post });
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
      return res.status(400).json({ error: "Text field is required" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
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

const getFeedPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const following = user.following;
    const feed = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });
    res.status(200).json(feed);
  } catch (error) {
    res.status(500).json(error.message);
    console.log(`Error Occurred : ${error.message}`);
  }
};

const getUserPost = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const post = await Post.find({ postedBy: user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error.message);
    console.log(`Error Occurred : ${error.message}`);
  }
};
export {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPost,
  getUserPost,
  commentLikeUnlikePost,
  commentReplyToPost,
};
