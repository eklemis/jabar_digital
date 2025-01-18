const validateNIK = require("../validateNIK");

describe("validateNIK", () => {
  test("should return true for valid NIK (16 numeric characters)", () => {
    expect(validateNIK("1234567890123456")).toBe(true);
  });

  test("should return false for invalid NIK (less than 16 characters)", () => {
    expect(validateNIK("123456789012345")).toBe(false);
  });

  test("should return false for invalid NIK (non-numeric characters)", () => {
    expect(validateNIK("12345ABC90123456")).toBe(false);
  });
});
