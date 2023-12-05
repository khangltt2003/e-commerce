import User from "../modules/user.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../middlewares/jwt.js";
import jwt from "jsonwebtoken";
import { sendMail } from "../ultils/sendmail.js";
import crypto from "crypto";
import { response } from "express";

//async handler will catch error in send to error handler in index route
const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname, mobile } = req.body;
  if (!email || !password || !firstname || !lastname) {
    return res.status(400).json({
      success: false,
      mes: "Missing inputs",
    });
  }
  //check if  email && mobile already exist
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
  //exclude password, refresh token, and role from showing
  const { password, role, refreshToken, ...userData } = user.toObject();
  //create accesstoken by jwt
  const accessToken = generateAccessToken(userData._id, role); //create access token using id and role
  const newRefreshToken = generateRefreshToken(userData._id); // create refresh token using id
  //update and store refresh token in database
  await User.findByIdAndUpdate({ _id: userData._id }, { refreshToken: newRefreshToken }, { new: true });
  //store refresh token in cookie for 7 days
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true, //accept only https
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days to ms
  });
  return res.status(200).json({
    success: true,
    mes: "Login successfully",
    accessToken,
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

//forgot password
//client sends request to reset password to server
//server checks and sends reset password link to user's email + access token to that page
//client clicks the link and send back the request
//server check reset password is valid (the same as sent token) or not
//change password

//prompt user to add email
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) throw new Error("Missing email");

  const user = await User.findOne({ email: email });
  if (!user) throw new Error("Invalid email");

  const resetToken = crypto.randomBytes(32).toString("hex"); //create a random string as reset token
  user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex"); //hash reset token
  user.passwordResetExpire = Date.now() + 10 * 60 * 1000;
  await user.save();

  //send to html to user's mail
  //direct user to /api/user/resetpassword/${resetToken} to check reset token
  const html = `<h1>Forgot Password</h1>
                <h3>Click The Link below to reset your password</h3>
                 <a href=${process.env.SEVER_URL}/api/user/resetpassword/${resetToken}><button>Click this!!!</button></a>`;

  //send mail using nodemailer (utils)
  const response = await sendMail(email, html);
  return res.status(200).json({
    success: response ? true : false,
    response,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  //get reset password from params
  //{{user_url}}/resetpassword/08fca68ab438ea156b875ae4517e01124b247ed46506c295da0bca08fb9da515
  const { resetToken } = req.params;
  const { password } = req.body; //
  const hashedResetToken = crypto.createHash("sha256").update(resetToken).digest("hex"); //hash reset token to compare with hashed reset token in database
  const user = await User.findOne(
    { passwordResetToken: hashedResetToken, passwordResetExpire: { $gt: Date.now() } }, //invalid when reset token expire time less than current time
    { password: 0, role: 0, refreshToken: 0 }
  );
  if (!user) throw new Error("Invalid reset password token");
  //update user password and set reset password token to undefined
  user.passwordChangedAt = Date.now();
  user.password = await bcrypt.hash(password, 10);
  user.passwordResetExpire = undefined;
  user.passwordResetToken = undefined;
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    res: user ? "Your password is updated" : "Something went wrong",
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, { password: 0, refreshToken: 0 });
  return res.status(200).json({
    success: users ? true : false,
    res: users ? users : "No users in database",
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  if (!_id) throw new Error("no id");
  const response = await User.findOneAndDelete({ _id: _id });
  return res.status(200).json({
    success: response ? true : false,
    res: response ? `user with "${response.email}" is deleted` : "something wrong",
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (req.body.hasOwnProperty("role")) throw new Error("cannot change role");
  if (!_id || Object.keys(req.body).length === 0) throw new Error("missing input");

  const response = await User.findByIdAndUpdate({ _id: _id }, req.body, {
    password: 0,
    role: 0,
    refreshToken: 0,
    new: true,
  });
  return res.status(200).json({
    success: response ? true : false,
    result: response ? response : "something went wrong",
  });
});

const updateUserbyAdmin = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  if (!_id || Object.keys(req.body).length === 0) throw new Error("missing input");
  const response = await User.findByIdAndUpdate({ _id: _id }, req.body, {
    password: 0,
    role: 0,
    refreshToken: 0,
    new: true,
  });
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? `User with email "${response.email}" is updated` : "something went wrong",
    response: response,
  });
});

export {
  register,
  loginByEmail,
  loginByMobile,
  getCurrUser,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getAllUsers,
  deleteUser,
  updateUser,
  updateUserbyAdmin,
};
