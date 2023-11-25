import User from "../modules/user.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middlewares/jwt.js";

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

//access token - verify user and distribute role
//refresh token - reset access toke
const loginSuccess = asyncHandler(async (user, res) => {
  //exclude password and role from showing
  const { password, role, ...userData } = user.toObject();
  //retrieve password and role out of user
  //create accesstoken by jwt
  const accessToken = generateAccessToken(userData._id, userData.role); //create access token
  const refreshToken = generateRefreshToken(userData._id); // create refresh token

  //update and store refresh token in database
  await User.findByIdAndUpdate(
    { _id: userData._id }, //query
    { refreshToken: refreshToken }, //update
    { new: true }
  );

  //send refresh token to cookie
  //response return refresh token to cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, //accept only https
    maxAge: 14 * 24 * 60 * 60 * 1000, //14 days to ms
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
    { refreshToken: 0, password: 0, role: 0 }
  );
  return res.status(200).json({
    success: currUser ? true : false,
    res: currUser ? currUser : "User not found",
  });
});

export { register, loginByEmail, loginByMobile, getCurrUser };
