import express from "express";
import { register } from "../controllers/user.js";
const router = express.Router();

router.post("/register", register);

export { router };

//CRUD = create read update delete
//HTTPS  post get put delete
