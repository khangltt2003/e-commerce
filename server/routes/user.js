import express from "express";
import {
  getCurrUser,
  loginByEmail,
  loginByMobile,
  register,
} from "../controllers/user.js";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.js";
const router = express.Router();

router.post("/register", register);
router.post("/login/email", loginByEmail);
router.post("/login/mobile", loginByMobile);
router.get("/current", verifyAccessToken, getCurrUser);
// router.get("/register", (req, res) => {
//   res.send("Register page");
// });
export { router };

//CRUD = create read update delete
//HTTPS  post get put delete
