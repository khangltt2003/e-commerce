import Product from "../modules/product.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify";
import { deleteImageFromS3, getImageFromS3, uploadImageToS3 } from "../ultils/s3Command.js";

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
  let fields = `title description price brand reviews images`;
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
  const products = await Product.find(formatedQuery).sort(sortBy).select(fields).skip(skip).limit(limit);
  //const response = await Product.find(formatedQuery).sort(sortBy).select(fields);
  let response = await Promise.all(
    products.map(async (product) => {
      if (product.images.length === 0) return product;
      product = product.toObject();
      const url = await getImageFromS3(product.images[0]);
      return { ...product, imageURL: url };
    })
  );
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot get products",
    count: response.length,
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  let product = await Product.findById(_id);
  product = product.toObject(); //convert mongoose object to normal object
  product.imageURL = [];
  for (const image of product.images) {
    let url = await getImageFromS3(image);
    product.imageURL.push(url);
  }
  return res.status(200).json({
    success: product ? true : false,
    product: product ? product : "cannot find product",
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("missing infomation");
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

const uploadProductImage = asyncHandler(async (req, res) => {
  const { _id: productId } = req.params;
  const images = req.files;
  //console.log(images);
  for (const image of images) {
    const imageKey = await uploadImageToS3(productId, image);
    await Product.findByIdAndUpdate(productId, { $push: { images: imageKey } });
  }
  const response = await Product.findById(productId);
  return res.status(200).json({
    response,
  });
});

const deleteProductImage = asyncHandler(async (req, res) => {
  const { imageId } = req.params;
  const productId = imageId.split("_")[0];
  //console.log(productId, imageId);
  const result = await deleteImageFromS3(imageId);
  console.log(result);
  const response = await Product.findByIdAndUpdate({ _id: productId }, { $pull: { images: imageId } }, { new: true });
  return res.status(200).json({
    response,
  });
});

const getProductImage = asyncHandler(async (req, res) => {
  const { _id: productId } = req.params;
  const product = await Product.findById(productId);
  const images = product.images;
  let response = [];
  for (const image of images) {
    const imageURL = await getImageFromS3(image);
    response.push(imageURL);
  }
  return res.status(200).json({
    response,
  });
});

export {
  deleteProduct,
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  reviewProduct,
  uploadProductImage,
  getProductImage,
  deleteProductImage,
};
