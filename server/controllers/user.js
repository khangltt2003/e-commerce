import User from "../modules/user.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../middlewares/jwt.js";

//async handler will catch error in send to error handler in index route
const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname, mobile } = req.body;
  if (!email || !password || !firstname || !lastname) {
    return res.status(400).json({
      success: false,
      mes: "Missing inputs",
    });
  }

  //check if  email && mobile exist
  const emailFound = await User.findOne({ email: email });
  if (emailFound) {
    throw Error("Email is already used!!!");
  }
  const mobileFound = await User.findOne({ mobile: mobile });
  if (mobileFound) {
    throw Error("Mobile number is already used!!!");
  }

  const saltRound = 10;
  const hashedPassword = await bcrypt.hash(password, saltRound);
  const newUser = new User({ ...req.body, password: hashedPassword });
  const response = await newUser.save();
  console.log(response);
  return res.status(200).json({
    success: response ? true : false,
    message: "Registered successfully!!! Go log in!!!",
    response,
  });
});

const loginByEmail = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      mes: "Missing input",
    });
  }
  const userFound = await User.findOne({ email: email });
  //if found user and input passwordd == hashed password
  if (userFound && (await bcrypt.compare(password, userFound.password))) {
    loginSuccess(userFound, res);
  } else {
    throw Error("Login failed. Invalid email or password");
  }
});

const loginByMobile = asyncHandler(async (req, res) => {
  const { mobile, password } = req.body;
  if (!mobile || !password) {
    return res.status(400).json({
      success: false,
      mes: "Missing input",
    });
  }

  const userFound = await User.findOne({ mobile: mobile });
  if (userFound && (await bcrypt.compare(password, userFound.password))) {
    loginSuccess(userFound, res);
  } else {
    throw Error("Login failed. Invalid mobile number or password");
  }
});

const loginSuccess = (user, res) => {
  const { password, role, ...userData } = user.toObject();
  //create accesstoken by jwt
  const accessToken = generateAccessToken(userData._id, userData.role);
  return res.status(200).json({
    success: true,
    mes: "Login successfully",
    accessToken,
    userData,
  });
};

export { register, loginByEmail, loginByMobile };
