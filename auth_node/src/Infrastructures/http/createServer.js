const express = require("express");
const bodyParser = require("body-parser");
const { scopePerRequest } = require("awilix-express");
const container = require("../container");
const UserRoutes = require("../../Interfaces/http/api/users/userRoutes");
const DomainErrorTranslator = require("../../Commons/exceptions/DomainErrorTranslator");
const ClientError = require("../../Commons/exceptions/ClientError");

const createServer = () => {
  const app = express();

  // Middleware
  app.use(bodyParser.json());

  // Awilix middleware: create scope for each request
  app.use(scopePerRequest(container));

  // Register routes
  app.use("/users", UserRoutes);

  // Error-handling middleware
  app.use((err, req, res, next) => {
    const translatedError = DomainErrorTranslator.translate(err);

    if (translatedError instanceof ClientError) {
      return res.status(translatedError.statusCode).json({
        status: "fail",
        message: translatedError.message,
      });
    }
    console.error(err);

    res.status(500).json({
      status: "error",
      message: "An unexpected server error occurred.",
    });
  });

  return app;
};

module.exports = createServer;
