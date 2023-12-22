import asyncHandler from "express-async-handler";
import blogCategory from "../modules/blogCategory.js";

const createBlogCategory = asyncHandler(async (req, res) => {
  if (!req.body.title) throw new Error("missing information");
  const response = await blogCategory.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot create blog category",
  });
});

const getAllBlogCategories = asyncHandler(async (req, res) => {
  const response = await blogCategory.find();
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot get blog categories",
  });
});

const getBlogCategory = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const response = await blogCategory.findById(_id);
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot get blog category",
  });
});

const updateBlogCategory = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  if (!req.body.title) throw new Error("missing information");
  const response = await blogCategory.findByIdAndUpdate(_id, req.body, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot update blog category",
  });
});

const deleteBlogCategory = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const response = await blogCategory.findByIdAndDelete({ _id });
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot delete blog category",
  });
});

export { deleteBlogCategory, createBlogCategory, updateBlogCategory, getAllBlogCategories, getBlogCategory };
