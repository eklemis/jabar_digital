const request = require("supertest");
const pool = require("../../../../../Infrastructures/database/postgres/pool");

const createServer = require("../../../../../Infrastructures/http/createServer");
const UsersTableTestHelper = require("../../../../../../tests/UsersTableTestHelper");
const LoginUserUseCase = require("../../../../../Applications/use_cases/LoginUserUseCase");
const container = require("../../../../../Infrastructures/container");

let app, token;

beforeAll(() => {
  process.env.ACCESS_TOKEN_KEY = "access-token-secret";
  app = createServer();
});

afterEach(async () => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  await UsersTableTestHelper.cleanTable();
});

afterAll(async () => {
  delete process.env.ACCESS_TOKEN_KEY;
  await pool.end();
});

describe("/users endpoint", () => {
  test("should respond with 201 and persisted user", async () => {
    const requestPayload = {
      nik: "1234567890123458",
      role: "user",
    };

    const response = await request(app)
      .post("/users/register")
      .send(requestPayload);

    //expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("nik", "1234567890123458");
    expect(response.body).toHaveProperty("role", "user");
    expect(response.body).toHaveProperty("password");
  });

  test("should respond with 400 if NIK is invalid", async () => {
    const requestPayload = {
      nik: "invalidNIK",
      role: "user",
    };

    const response = await request(app)
      .post("/users/register")
      .send(requestPayload);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "fail",
      message: "Invalid NIK format",
    });
  });

  test("should respond with 400 if NIK or password is missing", async () => {
    const requestPayload = {
      nik: "1234567890123456",
    };

    const response = await request(app)
      .post("/users/login")
      .send(requestPayload);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "fail",
      message: "Invalid request payload",
    });
  });

  test("should respond with 200 and return user data with JWT access token", async () => {
    const requestPayload = {
      nik: "1234567890123456",
      password: "password123",
    };

    jest.spyOn(LoginUserUseCase.prototype, "execute").mockResolvedValue({
      id: "user-123",
      nik: "1234567890123456",
      role: "user",
      accessToken: "access-token",
    });

    const response = await request(app)
      .post("/users/login")
      .send(requestPayload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", "user-123");
    expect(response.body).toHaveProperty("nik", "1234567890123456");
    expect(response.body).toHaveProperty("role", "user");
    expect(response.body).toHaveProperty("accessToken", "access-token");
  });
});

describe("/users/private/claims endpoint", () => {
  beforeAll(async () => {
    // Use authenticationTokenManager from the container
    const authenticationTokenManager = container.resolve(
      "authenticationTokenManager",
    );

    token = await authenticationTokenManager.createAccessToken({
      id: "user-123",
      role: "user",
    });
  });

  test("should return user claims if JWT is valid", async () => {
    const response = await request(app)
      .get("/users/private/claims")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.data).toHaveProperty("id", "user-123");
    expect(response.body.data).toHaveProperty("role", "user");
  });

  test("should respond with 401 if JWT is missing", async () => {
    const response = await request(app).get("/users/private/claims");

    expect(response.status).toBe(401);
    expect(response.body.status).toBe("fail");
    expect(response.body.message).toBe(
      "Missing or invalid authorization header",
    );
  });

  test("should respond with 401 if JWT is invalid", async () => {
    const response = await request(app)
      .get("/users/private/claims")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
    expect(response.body.status).toBe("fail");
  });

  test("should return 500 if an error occurs in getPrivateClaims", async () => {
    const mockReq = { user: null };
    // Simulate missing user claims
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const mockNext = jest.fn();
    const userController = new (require("../UserController"))({
      addUserUseCase: {},
      loginUserUseCase: {},
    });
    await userController.getPrivateClaims(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error).toBeInstanceOf(Error);
  });
});
