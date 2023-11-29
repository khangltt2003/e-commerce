import express from "express";
import {
  forgotPassword,
  getCurrUser,
  loginByEmail,
  loginByMobile,
  logout,
  refreshAccessToken,
  register,
  resetPassword,
} from "../controllers/user.js";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.js";
const router = express.Router();

router.post("/register", register);
router.post("/login/email", loginByEmail);
router.post("/login/mobile", loginByMobile);
//when user want to access to specific, authorize them by verifyAccessToken
router.get("/current", verifyAccessToken, getCurrUser);
router.post("/refreshAccessToken", refreshAccessToken);
router.post("/logout", logout);
router.get("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);
// router.get("/register", (req, res) => {
//   res.send("Register page");
// });
export { router };

//CRUD = create read update delete
//HTTPS  post get put delete
//get - delete : query
//put - post : body
