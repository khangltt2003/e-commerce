import express from "express";

import { isAdmin, verifyAccessToken } from "../middlewares/verifyAccessToken.js";
import { createBrand, deleteBrand, getAllBrands, getBrand, updateBrand } from "../controllers/brand.js";

const Router = express.Router();

Router.post("/", [verifyAccessToken, isAdmin], createBrand);
Router.get("/", getAllBrands);
Router.get("/:_id", getBrand);
Router.put("/:_id", [verifyAccessToken, isAdmin], updateBrand);
Router.delete("/:_id", [verifyAccessToken, isAdmin], deleteBrand);

export default Router;
