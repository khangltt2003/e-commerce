import Product from "../modules/product.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify";

const createProduct = asyncHandler(async (req, res) => {
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
  let fields = `title description price brand reviews`;
  if (req.query.fields) {
    fields = req.query.fields.split(",").join(" ");
  }
  //console.log(formatedQuery);

  //pagination
  //limit: number of object in 1 page
  //skip: number of object skipped ex: skip: 10 skip first 10 objects

  const currentPage = +req.query.page || 1; //add + to convert from string to number
  const limit = +req.query.limit || 10;
  const skip = limit * (currentPage - 1);
  const response = await Product.find(formatedQuery).sort(sortBy).select(fields).skip(skip).limit(limit);
  //const response = await Product.find(formatedQuery).sort(sortBy).select(fields);

  //console.log(response);
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
  const response = await Product.findByIdAndUpdate(
    { _id: _id },
    { ...req.body, slug: slugify(req.body.title) },
    { new: true }
  );
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

const reviewProduct = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, rate, comment } = req.body;
  if (!rate || !productId) throw new Error("missing input");
  const product = await Product.findById(productId);

  // check if the user already review the product
  //  exist => update the review
  //  null => add new review
  const alreadyReviewed = product.reviews.find((item) => item.postedBy.toString() === userId);
  if (alreadyReviewed) {
    await Product.updateOne(
      { reviews: { $elemMatch: alreadyReviewed } },
      { $set: { "reviews.$.rate": rate, "reviews.$.comment": comment } }
    );
  } else {
    await Product.findByIdAndUpdate(
      { _id: productId },
      { $push: { reviews: { rate, comment, postedBy: userId } }, $inc: { totalReviews: 1 } } //push new review and add 1 to total review
    );
  }
  const newProductData = await Product.findById(productId);
  const totalPoint = newProductData.reviews.reduce((sum, el) => sum + +el.rate, 0);
  const numReviews = newProductData.reviews.length;

  const response = await Product.findByIdAndUpdate(
    productId,
    { $set: { averageRate: Math.round((totalPoint * 10) / numReviews) / 10 } },
    { new: true }
  );
  return res.status(200).json({
    success: response ? true : false,
    response,
  });
});

export { deleteProduct, getAllProducts, getProduct, createProduct, updateProduct, reviewProduct };
