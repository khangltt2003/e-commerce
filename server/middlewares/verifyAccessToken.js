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
      //ex decode { _id: '65611c6a14f4fcda5ce3aa87', iat: 1700900288, exp: 1701505088 }
      //set req.user to decode -> get current user by id
      req.user = decode;
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
