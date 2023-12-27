import asyncHandler from "express-async-handler";
import Brand from "../modules/brand.js";

const createBrand = asyncHandler(async (req, res) => {
  if (!req.body.title) throw new Error("missing information");
  const response = await Brand.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot create blog category",
  });
});

const getAllBrands = asyncHandler(async (req, res) => {
  const response = await Brand.find();
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot get blog categories",
  });
});

const getBrand = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const response = await Brand.findById(_id);
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot get blog category",
  });
});

const updateBrand = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  if (!req.body.title) throw new Error("missing information");
  const response = await Brand.findByIdAndUpdate(_id, req.body, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot update blog category",
  });
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const response = await Brand.findByIdAndDelete({ _id });
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot delete blog category",
  });
});

export { deleteBrand, createBrand, updateBrand, getAllBrands, getBrand };
