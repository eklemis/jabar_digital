const InvariantError = require("../../../../Commons/exceptions/InvariantError");
class UserController {
  constructor({ addUserUseCase, loginUserUseCase }) {
    this._addUserUseCase = addUserUseCase;
    this._loginUserUseCase = loginUserUseCase;
  }

  async register(req, res, next) {
    try {
      const { nik, role } = req.body;
      const user = await this._addUserUseCase.execute({ nik, role });
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { nik, password } = req.body;
      // Validate request payload
      if (!nik || !password) {
        throw new InvariantError("Invalid request payload");
      }

      const user = await this._loginUserUseCase.execute({ nik, password });
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async getPrivateClaims(req, res, next) {
    try {
      const userClaims = req.user; // Extracted by the middleware
      if (!userClaims) {
        throw new Error("Missing user claims");
      }
      res.status(200).json({
        status: "success",
        data: userClaims,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
