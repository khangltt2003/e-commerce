import asyncHandler from "express-async-handler";
import productCategory from "../modules/productCategory.js";

const createCategory = asyncHandler(async (req, res) => {
  if (!req.body.title) throw new Error("missing information");
  const response = await productCategory.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot create product category",
  });
});

const getAllCategories = asyncHandler(async (req, res) => {
  const response = await productCategory.find();
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot get product categories",
  });
});

const getCategory = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const response = await productCategory.findById(_id);
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot get product category",
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  if (!req.body.title) throw new Error("missing information");
  const response = await productCategory.findByIdAndUpdate(_id, req.body, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot update product category",
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const response = await productCategory.findByIdAndDelete({ _id });
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot delete product category",
  });
});

export { deleteCategory, createCategory, updateCategory, getAllCategories, getCategory };
