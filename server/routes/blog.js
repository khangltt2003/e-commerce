import express from "express";
import {
  createBlog,
  deleteBlog,
  dislikeBlog,
  getAllBlogs,
  getBlog,
  likeBlog,
  updateBlog,
} from "../controllers/blog.js";
import { isAdmin, verifyAccessToken } from "../middlewares/verifyAccessToken.js";

const Router = express.Router();

Router.post("/", [verifyAccessToken, isAdmin], createBlog);
Router.get("/", getAllBlogs);
Router.get("/:_id", getBlog);
Router.put("/:_id", [verifyAccessToken, isAdmin], updateBlog);
Router.put("/like/:_id", verifyAccessToken, likeBlog);
Router.put("/dislike/:_id", verifyAccessToken, dislikeBlog);
Router.delete("/:_id", [verifyAccessToken, isAdmin], deleteBlog);
export default Router;
