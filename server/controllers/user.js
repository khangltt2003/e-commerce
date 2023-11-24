import User from "../modules/user.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

//async handler will catch error in send to error handler in index route
const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname } = req.body;

  if (!email || !password || !firstname || !lastname) {
    return res.status(400).json({
      success: false,
      mes: "Missing inputs",
    });
  }
  const saltRound = 10;
  const hashedPassword = await bcrypt.hash(password, saltRound);
  const newUser = new User({ ...req.body, password: hashedPassword });
  const response = await newUser.save();
  return res.status(200).json({
    success: response ? true : false,
    response,
  });
});

export { register };
