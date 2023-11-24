import { router } from "./user.js";

const userRouter = router;

const initRoutes = (app) => {
  app.use("/api/user", userRouter);
};

export default initRoutes;
