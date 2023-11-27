import User from "../modules/user.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../middlewares/jwt.js";
import jwt from "jsonwebtoken";

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
    throw new Error("Email is already used!!!");
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
  //find email in database
  const userFound = await User.findOne({ email: email });
  //if found user and input passwordd == hashed password
  if (userFound && (await bcrypt.compare(password, userFound.password))) {
    loginSuccess(userFound, res);
  } else {
    throw new Error("Login failed. Invalid email or password");
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
    throw new Error("Login failed. Invalid mobile number or password");
  }
});

//access token - verify user and distribute role
//refresh token - reset access toke
const loginSuccess = asyncHandler(async (user, res) => {
  //exclude password and role from showing
  const { password, role, ...userData } = user.toObject();
  //create accesstoken by jwt
  const accessToken = generateAccessToken(userData._id, role); //create access token using id and role
  const refreshToken = generateRefreshToken(userData._id); // create refresh token using id
  //update and store refresh token in database
  await User.findByIdAndUpdate({ _id: userData._id }, { refreshToken: refreshToken }, { new: true });
  //store in cookie for 7 days
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, //accept only https
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days to ms
  });
  return res.status(200).json({
    success: true,
    mes: "Login successfully",
    accessToken,
    refreshToken,
    userData,
  });
});

const getCurrUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const currUser = await User.findById(
    { _id: _id },
    { refreshToken: 0, password: 0, role: 0 } //exclude refresh token, password, role from showing
  );
  return res.status(200).json({
    success: currUser ? true : false,
    res: currUser ? currUser : "User not found",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  //check if there is refresh token in cookie
  if (!cookie || !cookie.refreshToken) {
    throw new Error("No refresh token in cookies");
  }
  //verify refresh token
  //{ _id: '65613027a00db6dc9df36a85', iat: 1701070908, exp: 1701070938 }
  const decode = jwt.verify(cookie.refreshToken, process.env.JWT_SECRET_KEY);
  //find user and check if refresh token match user's refresh token in database simutaneously
  const user = await User.findOne({ _id: decode._id, refreshToken: cookie.refreshToken });
  return res.status(200).json({
    success: user ? true : false,
    newAccessToken: user ? generateAccessToken(user._id, user.role) : "Refresh token does not match",
  });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  //check if refresh token in cookies
  if (!cookie || !cookie.refreshToken) throw new Error("No refresh token in cookies");
  //delete refresh token in database
  await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: "" }, { new: true });
  //delete refresh token in cookie
  res.clearCookie("refreshToken", { httpOnly: true, secure: true });
  return res.status(200).json({
    success: true,
    mes: "Logged out",
  });
});

export { register, loginByEmail, loginByMobile, getCurrUser, refreshAccessToken, logout };
