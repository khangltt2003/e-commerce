import express from "express";
import {
  createProduct,
  deleteProduct,
  deleteProductImage,
  getAllProducts,
  getProduct,
  getProductImage,
  reviewProduct,
  updateProduct,
  uploadProductImage,
} from "../controllers/product.js";
import { isAdmin, verifyAccessToken } from "../middlewares/verifyAccessToken.js";
import upload from "../config/multer.js";
import insertData from "../controllers/insertData.js";

const Router = express.Router();

Router.post("/", [verifyAccessToken, isAdmin], createProduct);
Router.get("/", getAllProducts);
Router.get("/:_id", getProduct);
Router.put("/review", verifyAccessToken, reviewProduct);
Router.post("/insertdata", [verifyAccessToken, isAdmin], insertData);
Router.put("/:_id", [verifyAccessToken, isAdmin], updateProduct);
Router.delete("/:_id", [verifyAccessToken, isAdmin], deleteProduct);
Router.put("/uploadproductimage/:_id", [verifyAccessToken, isAdmin], upload.array("images"), uploadProductImage);
Router.get("/getproductimage/:_id", getProductImage);
Router.delete("/deleteproductimage/:imageId", [verifyAccessToken, isAdmin], deleteProductImage);

export default Router;
