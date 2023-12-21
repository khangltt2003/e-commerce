import { errorHandler, notFound } from "../middlewares/errorHandler.js";
import userRouter from "./user.js";
import productRouter from "./product.js";
import productCategoryRouter from "./productCategory.js";
const initRoutes = (app) => {
  //app will find all routes in router if not found, errorHandler will handle it
  app.use("/api/user", userRouter); //mount user to user route
  app.use("/api/product", productRouter); //mount user to user route
  app.use("/api/productCategory", productCategoryRouter); //mount user to user route

  app.use(notFound); //not found route
  app.use(errorHandler); //error handler middleware
};

export default initRoutes;
