const express = require("express");
const { makeInvoker } = require("awilix-express");
const UserController = require("./UserController");
const AuthMiddleware = require("../../../../Infrastructures/http/middleware/AuthMiddleware");

const router = express.Router();

// Awilix makeInvoker binds the controller to the DI container
const api = makeInvoker(UserController);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user with NIK and role.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nik
 *               - role
 *             properties:
 *               nik:
 *                 type: string
 *                 example: "1234567890123456"
 *               role:
 *                 type: string
 *                 example: "user"
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 nik:
 *                   type: string
 *                 role:
 *                   type: string
 *                 password:
 *                   type: string
 *       400:
 *         description: Invalid request payload
 */
router.post("/register", api("register"));

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user and return JWT token
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nik
 *               - password
 *             properties:
 *               nik:
 *                 type: string
 *                 example: "1234567890123456"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 nik:
 *                   type: string
 *                 role:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", api("login"));

// Use the AuthMiddleware for the private endpoint
const authMiddleware = (req, res, next) =>
  AuthMiddleware(req.container.resolve("authenticationTokenManager"))(
    req,
    res,
    next,
  );
/**
 * @swagger
 * /users/private/claims:
 *   get:
 *     summary: Get user claims from JWT
 *     description: Retrieves the private claims of the authenticated user based on the provided JWT.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user claims
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: user-123
 *                     nik:
 *                       type: string
 *                       example: 1234567890123456
 *                     role:
 *                       type: string
 *                       example: user
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Missing or invalid authorization header
 */
router.get("/private/claims", authMiddleware, api("getPrivateClaims"));

module.exports = router;
