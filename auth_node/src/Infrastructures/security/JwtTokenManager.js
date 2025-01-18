const AuthenticationTokenManager = require("../../Applications/security/AuthenticationTokenManager");
const InvariantError = require("../../Commons/exceptions/InvariantError");

class JwtTokenManager extends AuthenticationTokenManager {
  constructor(jwt) {
    super();

    if (!process.env.ACCESS_TOKEN_KEY || !process.env.REFRESH_TOKEN_KEY) {
      throw new Error("JWT_TOKEN_MANAGER: MISSING_ENV_VARIABLES");
    }

    this._jwt = jwt;
  }

  async createAccessToken(payload) {
    return this._jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: "1h",
    });
  }

  async createRefreshToken(payload) {
    return this._jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
      expiresIn: "7d",
    });
  }

  async verifyRefreshToken(token) {
    try {
      this._jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
    } catch (error) {
      throw new InvariantError("Invalid refresh token");
    }
  }

  async decodePayload(token) {
    const decoded = this._jwt.decode(token);
    if (!decoded) {
      throw new InvariantError("Unable to decode token");
    }
    return decoded; // Return the full decoded object
  }
}

module.exports = JwtTokenManager;
