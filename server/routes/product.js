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
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const Router = express.Router();

Router.post("/", [verifyAccessToken, isAdmin], createProduct);
Router.get("/", getAllProducts);
Router.get("/:_id", getProduct);
Router.put("/review", verifyAccessToken, reviewProduct);
Router.put("/:_id", [verifyAccessToken, isAdmin], updateProduct);
Router.delete("/:_id", [verifyAccessToken, isAdmin], deleteProduct);
Router.put("/uploadproductimage/:_id", [verifyAccessToken, isAdmin], upload.array("imageName", 12), uploadProductImage);
Router.get("/getproductimage/:_id", getProductImage);
Router.delete("/deleteproductimage/:_id/:imageId", [verifyAccessToken, isAdmin], deleteProductImage);
export default Router;
