const AuthMiddleware = require("../AuthMiddleware");
const AuthenticationTokenManager = require("../../../../Applications/security/AuthenticationTokenManager");
const jwt = require("jsonwebtoken");

describe("AuthMiddleware", () => {
  const mockToken = jwt.sign(
    { id: "user-123", role: "user" },
    "access-token-secret",
  );
  const mockTokenManager = new AuthenticationTokenManager();
  mockTokenManager.decodePayload = jest.fn().mockResolvedValue({
    id: "user-123",
    role: "user",
  });

  it("should attach user claims if token is valid", async () => {
    const req = { headers: { authorization: `Bearer ${mockToken}` } };
    const res = {};
    const next = jest.fn();

    const middleware = AuthMiddleware(mockTokenManager);
    await middleware(req, res, next);

    expect(req.user).toEqual({ id: "user-123", role: "user" });
    expect(next).toHaveBeenCalled();
  });

  it("should throw an error if token is missing", async () => {
    const req = { headers: {} };
    const res = {};
    const next = jest.fn();

    const middleware = AuthMiddleware(mockTokenManager);
    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should throw an error if token is invalid", async () => {
    mockTokenManager.decodePayload.mockRejectedValueOnce(
      new Error("Invalid token"),
    );
    const req = { headers: { authorization: `Bearer invalid-token` } };
    const res = {};
    const next = jest.fn();

    const middleware = AuthMiddleware(mockTokenManager);
    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
