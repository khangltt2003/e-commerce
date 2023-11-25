import jwt from "jsonwebtoken";
const generateAccessToken = (id, role) => {
  return jwt.sign({ _id: id, role }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
};

export { generateAccessToken };
