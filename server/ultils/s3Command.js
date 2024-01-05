import asyncHandler from "express-async-handler";
import s3 from "../config/awsS3.js";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
function getCurrentTime() {
  const now = new Date();
  const options = {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  const formattedDate = now.toLocaleString("en-US", options);
  const cleanedDate = formattedDate.replace(/[\/\s:,]/g, ""); // Remove commas, slashes, spaces, and colons
  return cleanedDate + String(now.getMilliseconds()).padStart(3, "0");
}

const uploadImageToS3 = asyncHandler(async (productId, imageInfo) => {
  const extension = imageInfo.mimetype.split("/")[1];
  const imageKey = `${productId}_${getCurrentTime()}.${extension}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: imageKey,
    ContentType: imageInfo.mimetype,
    Body: imageInfo.buffer,
  };
  const command = new PutObjectCommand(params);
  await s3.send(command);
  return imageKey;
});

const getImageFromS3 = asyncHandler(async (imageId) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: imageId,
  };
  const command = new GetObjectCommand(params);
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return url;
});

const deleteImageFromS3 = asyncHandler(async (imageId) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: imageId,
  };
  const command = new DeleteObjectCommand(params);
  return await s3.send(command);
});

export { uploadImageToS3, getImageFromS3, deleteImageFromS3 };
