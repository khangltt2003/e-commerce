import express from "express";
import dbConnect from "./config/dbconnect.js";
import "dotenv/config";
import initRoutes from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
dbConnect();
initRoutes(app);

app.listen(PORT, (req, res) => {
  console.log("Listening to port", PORT);
});
