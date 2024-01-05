import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  console.log(file);
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};

const limits = { fileSize: 1000000000, files: 6 };
const upload = multer({
  storage,
  fileFilter,
  limits,
});

export default upload;
