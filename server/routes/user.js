import express from "express";
import { loginByEmail, loginByMobile, register } from "../controllers/user.js";
const router = express.Router();

router.post("/register", register);
router.post("/login/email", loginByEmail);
router.post("/login/mobile", loginByMobile);

router.get("/register", (req, res) => {
  res.send("Register page");
});
export { router };

//CRUD = create read update delete
//HTTPS  post get put delete
