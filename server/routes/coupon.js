import express from "express";

import { isAdmin, verifyAccessToken } from "../middlewares/verifyAccessToken.js";
import { createCoupon, deleteCoupon, getAllCoupons, getCoupon, updateCoupon } from "../controllers/coupon.js";

const Router = express.Router();

Router.post("/", [verifyAccessToken, isAdmin], createCoupon);
Router.get("/", getAllCoupons);
Router.get("/:_id", getCoupon);
Router.put("/:_id", [verifyAccessToken, isAdmin], updateCoupon);
Router.delete("/:_id", [verifyAccessToken, isAdmin], deleteCoupon);

export default Router;
