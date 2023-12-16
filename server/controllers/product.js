import Product from "../modules/product.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify";

const createProduct = asyncHandler(async (req, res) => {
  console.log(req.body);
  if (
    Object.keys(req.body).length === 0 ||
    !req.body.title ||
    !req.body.description ||
    !req.body.price ||
    !req.body.brand
  )
    throw new Error("missing information");
  //create slug
  const slug = slugify(req.body.title);
  const response = await Product.create({ ...req.body, slug });
  return res.status(200).json({
    success: response ? true : false,
    newProduct: response ? response : "cannot create new product",
  });
});

//filter, pagination, sort
const getAllProducts = asyncHandler(async (req, res) => {
  const queryObj = { ...req.query }; //{ brand: 'nzxt', price: { gte: '100' }, sort: 'price' }
  // console.log(queryObj);
  //delete excluded fields from query object
  const excludedFields = ["page", "sort", "limit", "fields"]; //special fields
  excludedFields.forEach((item) => delete queryObj[item]);

  //use regex to add $ before each query to match with mongoose format
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //{ brand: 'nzxt', price: { $gte: '100' }, sort: 'price' }
  let formatedQuery = JSON.parse(queryStr);

  if (queryObj?.title) {
    formatedQuery.title = { $regex: queryObj.title, $option: "i" };
  }

  //sort
  let sortBy = { brand: 1, price: 1 };
  if (req.query.sort) {
    sortBy = req.query.sort.split(",").join(" "); // sort=brand,price => [brand, price] => "brand price"
  }
  //fields limit
  let fields = `title description price`;
  if (req.query.fields) {
    fields = req.query.fields.split(",").join(" ");
  }
  //console.log(formatedQuery);

  // const currentPage = req.query.page;
  // const numberOfItemInOnePage = 10;
  // const numItem = response.length;
  const response = await Product.find(formatedQuery).sort(sortBy).select(fields);
  console.log(response);
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot get products",
    count: response.length,
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

const updateProduct = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const response = await Product.findByIdAndUpdate({ _id: _id }, { ...req.body, slug: slugify(req.body.title) });
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
    mes: response ? `${response.title} is deleted` : "cannot delete product",
  });
});

export { deleteProduct, getAllProducts, getProduct, createProduct, updateProduct };
