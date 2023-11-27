import jwt from "jsonwebtoken";
const generateAccessToken = (id, role) => {
  return jwt.sign({ _id: id, role: role }, process.env.JWT_SECRET_KEY, {
    expiresIn: "15s",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};

export { generateAccessToken, generateRefreshToken };
