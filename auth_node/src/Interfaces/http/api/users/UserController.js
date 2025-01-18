class UserController {
  constructor({ addUserUseCase }) {
    this._addUserUseCase = addUserUseCase;
  }

  async register(req, res, next) {
    try {
      const { nik, role } = req.body;
      const user = await this._addUserUseCase.execute({ nik, role });
      res.status(201).json(user);
    } catch (error) {
      console.error("Error in UserController.register:", error);
      next(error);
    }
  }
}

module.exports = UserController;
