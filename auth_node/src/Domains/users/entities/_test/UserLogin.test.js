const UserLogin = require("../UserLogin");

describe("UserLogin", () => {
  describe("when instantiated with a valid payload", () => {
    it("should create a UserLogin instance correctly", () => {
      // Arrange
      const payload = {
        nik: "1234567890123456",
        password: "secret",
      };

      // Act
      const userLogin = new UserLogin(payload);

      // Assert
      expect(userLogin).toBeInstanceOf(UserLogin);
      expect(userLogin.nik).toBe(payload.nik);
      expect(userLogin.password).toBe(payload.password);
    });
  });

  describe("when instantiated with an invalid payload", () => {
    it("should throw an error if payload does not contain needed properties", () => {
      // Arrange
      const payload = {
        nik: "1234567890123456",
      };

      // Act & Assert
      expect(() => new UserLogin(payload)).toThrowError(
        "USER_ENTITY:NOT_CONTAIN_NEEDED_PROPERTY",
      );
    });

    it("should throw an error if payload properties do not meet data type specification", () => {
      // Arrange
      const payload = {
        nik: 1234567890123456, // Not a string
        password: {},
      };

      // Act & Assert
      expect(() => new UserLogin(payload)).toThrowError(
        "USER_ENTITY:NOT_MEET_DATA_TYPE_SPECIFICATION",
      );
    });
  });
});
