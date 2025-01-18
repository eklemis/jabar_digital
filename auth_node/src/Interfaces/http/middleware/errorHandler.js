const DomainErrorTranslator = require("../../../Commons/utils/DomainErrorTranslator");
const ClientError = require("../../../Commons/exceptions/ClientError");

function errorHandler(err, req, res, next) {
  // Translate the error if applicable
  const translatedError = DomainErrorTranslator.translate(err);

  if (translatedError instanceof ClientError) {
    // Handle client errors (400-499)
    return res.status(translatedError.statusCode).json({
      status: "fail",
      message: translatedError.message,
    });
  }

  if (!translatedError.isServer) {
    // Let non-server errors pass through (like 404)
    return next();
  }

  // Handle server errors (500+)
  console.error(translatedError); // Log server errors for debugging
  return res.status(500).json({
    status: "error",
    message: "An unexpected server error occurred.",
  });
}

module.exports = errorHandler;
