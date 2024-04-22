import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  likeUnlikePost,
  replyToPost,
  getFeedPost,
  getUserPost,
} from "../controller/postController.js";
import protectRoute from "../middlewares/protectRoute.js";

import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const route = express.Router();

route.get("/feed", protectRoute, getFeedPost);
route.get("/:id", getPost);
route.get("/user/:username", getUserPost);
route.post("/create", protectRoute, upload.single("image"), createPost);
route.delete("/:id", protectRoute, deletePost);
route.put("/likes/:id", protectRoute, likeUnlikePost);
route.put("/reply/:id", protectRoute, replyToPost);

export default route;
