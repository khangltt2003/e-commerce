import Product from "../modules/product.js";
import asyncHandler from "express-async-handler";

const getAllProducts = asyncHandler(async (req, res) => {
  const response = await Product.find({});
  return res.status(200).json({
    success: response ? true : false,
    products: response ? response : "cannot find product",
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const response = await Product.findById(_id);
  return res.status(200).json({
    success: response ? true : false,
    product: response ? response : "cannot find product",
  });
});

const createProduct = asyncHandler(async (req, res) => {
  console.log(req.body);
  if (
    Object.keys(req.body).length === 0 ||
    !req.body.title ||
    !req.body.description ||
    !req.body.price ||
    !req.body.quantity ||
    !req.body.brand
  )
    throw new Error("missing information");
  const response = await Product.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    newProduct: response ? response : "cannot create new product",
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const response = await Product.findByIdAndUpdate({ _id: _id }, req.body);
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? response : "cannot update product",
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const response = await Product.findByIdAndDelete(_id);
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "product is deleted" : "cannot delete product",
  });
});

export { deleteProduct, getAllProducts, getProduct, createProduct, updateProduct };
