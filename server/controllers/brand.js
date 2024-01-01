import asyncHandler from "express-async-handler";
import Brand from "../modules/brand.js";

const createBrand = asyncHandler(async (req, res) => {
  if (!req.body.brandname) throw new Error("missing information");
  const response = await Brand.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot create brand",
  });
});

const getAllBrands = asyncHandler(async (req, res) => {
  const response = await Brand.find();
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot get brand",
  });
});

const getBrand = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const response = await Brand.findById(_id);
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot get brand",
  });
});

const updateBrand = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("missing information");
  const response = await Brand.findByIdAndUpdate(_id, req.body, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot update brand",
  });
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const response = await Brand.findByIdAndDelete({ _id });
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot delete brand",
  });
});

export { deleteBrand, createBrand, updateBrand, getAllBrands, getBrand };
