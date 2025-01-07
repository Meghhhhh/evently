const asyncHandler = (requestHandler) => {
  console.log("inside asyncHandler");

  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

module.exports = { asyncHandler };
