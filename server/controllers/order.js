import order from "../modules/order.js";
import Order from "../modules/order.js";
import asyncHandler from "express-async-handler";
const createOrder = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const { orderedBy, products, address, amount, total } = req.body;
  if (!orderedBy || !products || !address || !amount || !total) throw new Error("missing information");
  const response = await Order.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "something went wrong.",
  });
});

const deleteOrder = asyncHandler(async (req, res) => {
  const { _id: userId, role } = req.user;
  const { _id: orderId } = req.params;
  const order = await Order.findById(orderId);
  if (role !== "admin" && order.orderedBy !== userId) throw new Error("dont have permission to delete this order");
  const response = await Order.deleteOne({ _id: orderId });
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "something went wrong",
  });
});
export { createOrder };
