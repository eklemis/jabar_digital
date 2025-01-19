const express = require("express");
const { makeInvoker } = require("awilix-express");
const UserController = require("./UserController");
const AuthMiddleware = require("../../../../Infrastructures/http/middleware/AuthMiddleware");

const router = express.Router();

// Awilix makeInvoker binds the controller to the DI container
const api = makeInvoker(UserController);

// Inject middleware and controller
router.post("/register", api("register"));
router.post("/login", api("login"));

// Use the AuthMiddleware for the private endpoint
const authMiddleware = (req, res, next) =>
  AuthMiddleware(req.container.resolve("authenticationTokenManager"))(
    req,
    res,
    next,
  );
router.get("/private/claims", authMiddleware, api("getPrivateClaims"));

module.exports = router;
