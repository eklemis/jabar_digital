const AuthenticationError = require("../../../Commons/exceptions/AuthenticationError");

const AuthMiddleware = (authenticationTokenManager) => {
  return async (req, res, next) => {
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        throw new AuthenticationError(
          "Missing or invalid authorization header",
        );
      }

      const token = authorizationHeader.split(" ")[1];

      try {
        // Validate and decode token
        const payload = await authenticationTokenManager.decodePayload(token);
        // Attach claims to the request object
        req.user = payload;
        next();
      } catch (error) {
        throw new AuthenticationError("Invalid token");
      }
    } catch (error) {
      next(error);
    }
  };
};

module.exports = AuthMiddleware;
