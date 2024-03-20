import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  likeUnlikePost,
  replyToPost,
  getFeedPost,
} from "../controller/postController.js";
import protectRoute from "../middlewares/protectRoute.js";

const route = express.Router();

route.get("/feed", protectRoute, getFeedPost);
route.get("/:id", getPost);
route.post("/create", protectRoute, createPost);
route.delete("/:id", protectRoute, deletePost);
route.post("/likes/:id", protectRoute, likeUnlikePost);
route.post("/reply/:id", protectRoute, replyToPost);

export default route;
