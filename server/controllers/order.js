import Order from "../modules/order.js";
import asyncHandler from "express-async-handler";
const createOrder = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const { orderedBy, products, address } = req.body;
});
