import asyncHandler from "express-async-handler";
import Coupon from "../modules/coupon.js";

const createCoupon = asyncHandler(async (req, res) => {
  const { couponname, discount, expire } = req.body;
  if (Object.keys(req.body).length === 0 || !couponname || !discount || !expire) throw new Error("missing information");
  const response = await Coupon.create({ ...req.body, expire: Date.now() + expire * 24 * 60 * 60 * 1000 });
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot create coupon",
  });
});

const getAllCoupons = asyncHandler(async (req, res) => {
  const response = await Coupon.find();
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot get coupon",
  });
});

const getCoupon = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const response = await Coupon.findById(_id);
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot get coupon",
  });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("missing information");
  const response = await Coupon.findByIdAndUpdate(_id, req.body, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot update coupon",
  });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const response = await Coupon.findByIdAndDelete({ _id });
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot delete coupon",
  });
});

export { deleteCoupon, createCoupon, updateCoupon, getAllCoupons, getCoupon };
