import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  followUnfollowUser,
  updateUser,
  getUserProfile,
} from "../controller/userController.js";
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

const routes = express.Router();

routes.get("/profile/:username", getUserProfile);
routes.post("/signup", signupUser);
routes.post("/login", loginUser);
routes.post("/logout", logoutUser);
routes.post("/follow/:id", protectRoute, followUnfollowUser);
routes.put("/update/:id", protectRoute, upload.single("image"), updateUser);

export default routes;
