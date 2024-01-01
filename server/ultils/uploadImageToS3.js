import asyncHandler from "express-async-handler";
import s3 from "../config/awsS3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

const uploadImageToS3 = asyncHandler(async (imageInfo) => {
  const imageKey = crypto.randomBytes(32).toString("hex");
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: imageKey,
    Body: imageInfo.buffer,
    ContentType: imageInfo.mimetype,
  };
  const command = new PutObjectCommand(params);
  await s3.send(command);
  return imageKey;
});

export { uploadImageToS3 };
