import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const aws_access_key = process.env.AWS_ACCESS_KEY;
const aws_secret_key = process.env.AWS_SECRET_KEY;
const aws_bucket_region = process.env.AWS_BUCKET_REGION;

const s3 = new S3Client({
  credentials: {
    accessKeyId: aws_access_key,
    secretAccessKey: aws_secret_key,
  },
  region: aws_bucket_region,
});

export default s3;
