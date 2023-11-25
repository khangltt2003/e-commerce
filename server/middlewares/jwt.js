import jwt from "jsonwebtoken";
const generateAccessToken = (id, role) => {
  return jwt.sign({ _id: id, role: role }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "14d",
  });
};

export { generateAccessToken, generateRefreshToken };
