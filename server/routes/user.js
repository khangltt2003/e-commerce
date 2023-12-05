import express from "express";
import {
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
  updateUser,
  updateUserbyAdmin,
} from "../controllers/user.js";
import { isAdmin, verifyAccessToken } from "../middlewares/verifyAccessToken.js";
const router = express.Router();

//user route
router.post("/register", register);
router.post("/login/email", loginByEmail);
router.post("/login/mobile", loginByMobile);
//when user want to access to protected resources, authorize first them by verifyAccessToken
router.get("/current", verifyAccessToken, getCurrUser);
router.post("/refreshAccessToken", refreshAccessToken);
router.post("/logout", logout);
router.get("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);
router.put("/current", verifyAccessToken, updateUser);
//admin route
router.get("/", [verifyAccessToken, isAdmin], getAllUsers);
router.put("/:_id", [verifyAccessToken, isAdmin], updateUserbyAdmin);
router.delete("/", [verifyAccessToken, isAdmin], deleteUser);

// router.get("/register", (req, res) => {
//   res.send("Register page");
// });
export { router };

//CRUD = create read update delete
//HTTPS  post get put delete
//get - delete : query
//put - post : body
