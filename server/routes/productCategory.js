import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from "../controllers/productCategory.js";
import { isAdmin, verifyAccessToken } from "../middlewares/verifyAccessToken.js";

const Router = express.Router();

Router.post("/", [verifyAccessToken, isAdmin], createCategory);
Router.get("/", getAllCategories);
Router.get("/:_id", getCategory);
Router.put("/:_id", [verifyAccessToken, isAdmin], updateCategory);
Router.delete("/:_id", [verifyAccessToken, isAdmin], deleteCategory);

export default Router;
