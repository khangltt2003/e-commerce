import express from "express";

import { isAdmin, verifyAccessToken } from "../middlewares/verifyAccessToken.js";
import {
  createBlogCategory,
  deleteBlogCategory,
  getAllBlogCategories,
  getBlogCategory,
  updateBlogCategory,
} from "../controllers/blogCategory.js";

const Router = express.Router();

Router.post("/", [verifyAccessToken, isAdmin], createBlogCategory);
Router.get("/", getAllBlogCategories);
Router.get("/:_id", getBlogCategory);
Router.put("/:_id", [verifyAccessToken, isAdmin], updateBlogCategory);
Router.delete("/:_id", [verifyAccessToken, isAdmin], deleteBlogCategory);

export default Router;
