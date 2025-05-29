class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // To differentiate between operational and programmer errors
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log the error stack for debugging (you can decide whether to log it in production)
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  // Send the response
  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { errorMiddleware, AppError };

