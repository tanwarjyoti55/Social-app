import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();
connectDB();
const app = express();

const PORT = process.env.PORT || 5000;

//middleware
app.use(express.json()); // To parse json data in req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in req.body
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

//routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(PORT, () => {
  console.log(`Server listen from port ${PORT}`);
});
