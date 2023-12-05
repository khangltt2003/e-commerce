import jwt from "jsonwebtoken";
const generateAccessToken = (id, role) => {
  return jwt.sign({ _id: id, role: role }, process.env.JWT_SECRET_KEY, {
    expiresIn: "59s",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
};

export { generateAccessToken, generateRefreshToken };
