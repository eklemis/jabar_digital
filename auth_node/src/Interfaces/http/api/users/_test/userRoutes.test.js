const request = require("supertest");
const createServer = require("../../../createServer");
const pool = require("../../../../../Infrastructures/database/postgres/pool");
const UsersTableTestHelper = require("../../../../../../tests/UsersTableTestHelper");

const AddUserUseCase = require("../../../../../Applications/use_cases/AddUserUseCase");

let app;

beforeAll(() => {
  app = createServer();
});

afterEach(async () => {
  jest.clearAllMocks();
  await UsersTableTestHelper.cleanTable();
});

afterAll(async () => {
  await pool.end();
});

describe("/users endpoint", () => {
  test("should respond with 201 and persisted user", async () => {
    const requestPayload = {
      nik: "1234567890123456",
      role: "user",
    };

    const response = await request(app)
      .post("/users/register")
      .send(requestPayload);

    console.log("Response Status:", response.status);
    console.log("Response Body:", response.body); // Debug the actual response

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("nik", "1234567890123456");
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

  test("should respond with 500 for unexpected server error", async () => {
    // Mock AddUserUseCase.execute to throw an unexpected error
    jest.spyOn(AddUserUseCase.prototype, "execute").mockImplementation(() => {
      throw new Error("Unexpected error!");
    });

    const requestPayload = {
      nik: "1234567890123456",
      role: "user",
    };

    const response = await request(app)
      .post("/users/register")
      .send(requestPayload);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      status: "error",
      message: "An unexpected server error occurred.",
    });
  });
});
