const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Authentication API",
      version: "1.0.0",
      description: "API documentation for the user authentication system",
      contact: {
        name: "Eklemis Santo Ndun",
        email: "eklemis.ndun@gmail.com",
      },
    },
    servers: [
      {
        url: `http://${process.env.HOST || "localhost"}:${process.env.PORT || 3000}`,
        description: "Authentication Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/Interfaces/http/api/users/userRoutes.js"], // Use relative path from project root
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
