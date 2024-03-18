import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  followUnfollowUser,
  updateUser,
} from "../controller/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const routes = express.Router();

routes.post("/signup", signupUser);
routes.post("/login", loginUser);
routes.post("/logout", logoutUser);
routes.post("/follow/:id", protectRoute, followUnfollowUser);
routes.post("/update/:id", protectRoute, updateUser);

export default routes;
