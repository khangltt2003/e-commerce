import Blog from "../modules/blog.js";
import asyncHandler from "express-async-handler";

const createBlog = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category) throw new Error("missing infomation");
  const response = await Blog.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "something went wrong.",
  });
});

const getBlog = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const response = await Blog.findById(_id)
    .populate("likedBy", "firstname lastname")
    .populate("dislikedBy", "firstname lastname");
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot find product",
  });
});

const getAllBlogs = asyncHandler(async (req, res) => {
  const response = await Blog.find();
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "something went wrong",
  });
});

const updateBlog = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("missing input");
  const response = await Blog.findByIdAndUpdate(_id, req.body, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot update blog",
  });
});

const likeBlog = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const { _id: blogId } = req.params;
  const blog = await Blog.findById(blogId);
  if (!blog) throw new Error("cannot find blog");
  const alreadyDisliked = blog.dislikedBy.some((el) => el.toString() === userId);

  if (alreadyDisliked) {
    const response = await Blog.findByIdAndUpdate(
      blogId,
      { $pull: { dislikedBy: userId }, $push: { likedBy: userId } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      response: response ? response : "something went wrong.",
    });
  }
  const alreadyLiked = blog.likedBy.some((el) => el.toString() === userId);
  if (alreadyLiked) {
    const response = await Blog.findByIdAndUpdate(blogId, { $pull: { likedBy: userId } }, { new: true });
    return res.status(200).json({
      success: response ? true : false,
      response: response ? response : "something went wrong.",
    });
  } else {
    const response = await Blog.findByIdAndUpdate(blogId, { $push: { likedBy: userId } }, { new: true });
    return res.status(200).json({
      success: response ? true : false,
      response: response ? response : "something went wrong.",
    });
  }
});

const dislikeBlog = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const { _id: blogId } = req.params;
  const blog = await Blog.findById(blogId);
  const alreadyLiked = blog.likedBy.some((el) => el.toString() === userId);
  if (alreadyLiked) {
    const response = await Blog.findByIdAndUpdate(
      blogId,
      { $pull: { likedBy: userId }, $push: { dislikedBy: userId } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      response: response ? response : "something went wrong.",
    });
  }
  const alreadyDisliked = blog.dislikedBy.some((el) => el.toString() === userId);
  if (alreadyDisliked) {
    const response = await Blog.findByIdAndUpdate(blogId, { $pull: { dislikedBy: userId } }, { new: true });
    return res.status(200).json({
      success: response ? true : false,
      response: response ? response : "something went wrong.",
    });
  } else {
    const response = await Blog.findByIdAndUpdate(blogId, { $push: { dislikedBy: userId } }, { new: true });
    return res.status(200).json({
      success: response ? true : false,
      response: response ? response : "something went wrong",
    });
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { _id: blogId } = req.params;
  const response = await Blog.findByIdAndDelete(blogId);
  return res.status(200).json({
    success: response ? true : false,
    response: response ? "blog deleted" : "cannot delete blog",
  });
});

export { createBlog, updateBlog, getAllBlogs, getBlog, likeBlog, dislikeBlog, deleteBlog };
