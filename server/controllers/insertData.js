import data from "../../scraper/items.json" assert { type: "json" };
import asyncHandler from "express-async-handler";
import slugify from "slugify";
import Product from "../modules/product.js";

const insertItem = async (item) => {
  await Product.create({
    title: item?.name,
    slug: slugify(item?.name),
    category: item?.category,
    brand: item?.brand,
    price: item?.price,
    description: item?.description,
    quantity: Math.floor(Math.random() * 101),
    thumb: item?.thumb,
    images: item?.images,
    variants: item?.variants,
  });
};

const insertData = asyncHandler(async (req, res) => {
  let promises = [];
  for (let item of data) {
    promises.push(insertItem(item));
  }
  await Promise.all(promises);
  return res.status(200).json({
    mes: "insert data into database",
  });
});

export default insertData;
