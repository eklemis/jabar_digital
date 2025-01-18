const express = require("express");
const { makeInvoker } = require("awilix-express");
const UserController = require("./UserController");

const router = express.Router();

// Awilix makeInvoker binds the controller to the DI container
const api = makeInvoker(UserController);

router.post("/register", api("register"));

module.exports = router;
