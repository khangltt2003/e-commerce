import jwt from "jsonwebtoken";
import AsyncHandler from "express-async-handler";

const verifyAccessToken = AsyncHandler(async (req, res, next) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const accessToken = req.headers.authorization.split(" ")[1];
    jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, decode) => {
      if (err) {
        return res.status(401).json({
          success: false,
          mes: "Invalid Access Token",
        });
      }
      req.user = decode;
      console.log(decode);
      next();
    });
  } else {
    return res.status(401).json({
      success: false,
      mes: "Require Access Token",
    });
  }
});

export { verifyAccessToken };
