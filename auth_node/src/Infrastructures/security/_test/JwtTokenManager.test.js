const jwt = require("jsonwebtoken");
const JwtTokenManager = require("../JwtTokenManager");
const InvariantError = require("../../../Commons/exceptions/InvariantError");

describe("JwtTokenManager", () => {
  const mockPayload = { id: "user-123", nik: "1234567890123456", role: "user" };

  beforeEach(() => {
    process.env.ACCESS_TOKEN_KEY = "access-token-secret";
    process.env.REFRESH_TOKEN_KEY = "refresh-token-secret";
  });

  afterEach(() => {
    delete process.env.ACCESS_TOKEN_KEY;
    delete process.env.REFRESH_TOKEN_KEY;
  });

  describe("Constructor", () => {
    it("should throw an error if ACCESS_TOKEN_KEY or REFRESH_TOKEN_KEY is not set", () => {
      delete process.env.ACCESS_TOKEN_KEY;
      expect(() => new JwtTokenManager(jwt)).toThrow(
        "JWT_TOKEN_MANAGER: MISSING_ENV_VARIABLES",
      );

      process.env.ACCESS_TOKEN_KEY = "access-token-secret";
      delete process.env.REFRESH_TOKEN_KEY;
      expect(() => new JwtTokenManager(jwt)).toThrow(
        "JWT_TOKEN_MANAGER: MISSING_ENV_VARIABLES",
      );
    });
  });

  describe("createAccessToken", () => {
    it("should generate a valid access token", async () => {
      const jwtTokenManager = new JwtTokenManager(jwt);
      const token = await jwtTokenManager.createAccessToken(mockPayload);

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
      expect(decoded.id).toBe(mockPayload.id);
      expect(decoded.nik).toBe(mockPayload.nik);
      expect(decoded.role).toBe(mockPayload.role);
    });
  });

  describe("createRefreshToken", () => {
    it("should generate a valid refresh token", async () => {
      const jwtTokenManager = new JwtTokenManager(jwt);
      const token = await jwtTokenManager.createRefreshToken(mockPayload);

      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
      expect(decoded.id).toBe(mockPayload.id);
      expect(decoded.nik).toBe(mockPayload.nik);
      expect(decoded.role).toBe(mockPayload.role);
    });
  });

  describe("verifyRefreshToken", () => {
    it("should not throw an error if refresh token is valid", async () => {
      const jwtTokenManager = new JwtTokenManager(jwt);
      const validToken = jwt.sign(mockPayload, process.env.REFRESH_TOKEN_KEY);

      await expect(
        jwtTokenManager.verifyRefreshToken(validToken),
      ).resolves.not.toThrow();
    });

    it("should throw InvariantError if refresh token is invalid", async () => {
      const jwtTokenManager = new JwtTokenManager(jwt);
      const invalidToken = "invalid-token";

      await expect(
        jwtTokenManager.verifyRefreshToken(invalidToken),
      ).rejects.toThrow(InvariantError);
    });
  });

  describe("decodePayload", () => {
    it("should decode payload correctly", async () => {
      const jwtTokenManager = new JwtTokenManager(jwt);
      const validToken = jwt.sign(mockPayload, process.env.ACCESS_TOKEN_KEY);

      const payload = await jwtTokenManager.decodePayload(validToken);
      expect(payload.id).toBe(mockPayload.id);
      expect(payload.nik).toBe(mockPayload.nik);
      expect(payload.role).toBe(mockPayload.role);
    });

    it("should throw InvariantError if token cannot be decoded", async () => {
      const jwtTokenManager = new JwtTokenManager(jwt);
      const invalidToken = "invalid-token";

      await expect(jwtTokenManager.decodePayload(invalidToken)).rejects.toThrow(
        InvariantError,
      );
    });
  });
});
