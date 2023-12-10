import express from "express";
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from "../controllers/product.js";

const Router = express.Router();

Router.get("/", getAllProducts);
Router.get("/:_id", getProduct);
Router.post("/", createProduct);
Router.put("/:_id", updateProduct);
Router.delete("/:_id", deleteProduct);
export default Router;
