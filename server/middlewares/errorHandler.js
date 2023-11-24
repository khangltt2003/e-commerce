const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found!`);
  res.status(400);
  next(error);
};

//middleware that has 4 parameter is consider error handler
const errorHandler = (error, req, res, next) => {
  //status code == 200 (success )change to 500 (db failure or internet failure)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return res.status(statusCode).json({
    success: false,
    mes: error.message,
  });
};

export { notFound, errorHandler };
