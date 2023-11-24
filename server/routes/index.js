import { errorHandler, notFound } from "../middlewares/errorHandler.js";
import { router } from "./user.js";

const userRouter = router;

const initRoutes = (app) => {
  //app will find all routes in router if not found, errorHandler will handle it
  app.use("/api/user", userRouter);

  app.use(notFound);
  app.use(errorHandler);
};

export default initRoutes;
