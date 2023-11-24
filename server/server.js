import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello");
  console.log(req);
});

app.listen(PORT, (req, res) => {
  console.log("Listening to port", PORT);
});
