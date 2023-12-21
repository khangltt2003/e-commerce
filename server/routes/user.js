import express from "express";
import {
  blockUser,
  deleteUser,
  forgotPassword,
  getAllUsers,
  getCurrUser,
  loginByEmail,
  loginByMobile,
  logout,
  refreshAccessToken,
  register,
  resetPassword,
  unblockUser,
  updateUser,
  updateUserbyAdmin,
} from "../controllers/user.js";
import { isAdmin, verifyAccessToken } from "../middlewares/verifyAccessToken.js";
const Router = express.Router();

//user route
Router.post("/register", register);
Router.post("/login/email", loginByEmail);
Router.post("/login/mobile", loginByMobile);
//when user want to access to protected resources, authorize first them by verifyAccessToken
Router.get("/current", verifyAccessToken, getCurrUser);
Router.post("/refreshAccessToken", refreshAccessToken);
Router.post("/logout", logout);
Router.get("/forgotpassword", forgotPassword);
Router.put("/resetpassword/:resetToken", resetPassword);
Router.put("/current", verifyAccessToken, updateUser);
//admin route
Router.get("/", [verifyAccessToken, isAdmin], getAllUsers);
Router.put("/:_id", [verifyAccessToken, isAdmin], updateUserbyAdmin);
Router.delete("/", [verifyAccessToken, isAdmin], deleteUser);
Router.put("/blockuser/:_id", [verifyAccessToken, isAdmin], blockUser);
Router.put("/unblockuser/:_id", [verifyAccessToken, isAdmin], unblockUser);

// Router.get("/register", (req, res) => {
//   res.send("Register page");
// });
export default Router;

//CRUD = create read update delete
//HTTPS  post get put delete
//get - delete : query
//put - post : body
