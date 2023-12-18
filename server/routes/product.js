import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  reviewProduct,
  updateProduct,
} from "../controllers/product.js";
import { isAdmin, verifyAccessToken } from "../middlewares/verifyAccessToken.js";

const Router = express.Router();

Router.post("/", [verifyAccessToken, isAdmin], createProduct);
Router.get("/", getAllProducts);
Router.get("/:_id", getProduct);
Router.put("/:_id", [verifyAccessToken, isAdmin], updateProduct);
Router.delete("/:_id", [verifyAccessToken, isAdmin], deleteProduct);
Router.put("/review", verifyAccessToken, reviewProduct);

export default Router;
