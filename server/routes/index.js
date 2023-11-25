import { errorHandler, notFound } from "../middlewares/errorHandler.js";
import { router } from "./user.js";

const userRouter = router;

const initRoutes = (app) => {
  //app will find all routes in router if not found, errorHandler will handle it
  app.use("/api/user", userRouter); //mount user to user route

  app.use(notFound); //not found route
  app.use(errorHandler); //error handler middleware
};

export default initRoutes;
