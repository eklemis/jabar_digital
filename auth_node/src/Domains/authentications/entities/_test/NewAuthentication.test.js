const NewAuthentication = require("../NewAuthentication");

describe("NewAuthentication", () => {
  describe("when instantiated with a valid payload", () => {
    it("should create a NewAuthentication instance correctly", () => {
      // Arrange
      const payload = {
        id: "user-123",
        nik: "1234567890123456",
        role: "user",
        accessToken: "accessToken",
        refreshToken: "refreshToken",
      };

      // Act
      const newAuthentication = new NewAuthentication(payload);

      // Assert
      expect(newAuthentication).toBeInstanceOf(NewAuthentication);
      expect(newAuthentication.id).toBe(payload.id);
      expect(newAuthentication.nik).toBe(payload.nik);
      expect(newAuthentication.role).toBe(payload.role);
      expect(newAuthentication.accessToken).toBe(payload.accessToken);
      expect(newAuthentication.refreshToken).toBe(payload.refreshToken);
    });
  });

  describe("when instantiated with an invalid payload", () => {
    it("should throw an error if payload does not contain all required properties", () => {
      // Arrange
      const payload = {
        id: "user-123",
        nik: "1234567890123456",
        role: "user",
        accessToken: "accessToken",
        // Missing refreshToken
      };

      // Act & Assert
      expect(() => new NewAuthentication(payload)).toThrowError(
        "NEW_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY",
      );
    });

    it("should throw an error if payload properties do not meet data type specification", () => {
      // Arrange
      const payload = {
        id: 123, // Not a string
        nik: "1234567890123456",
        role: "user",
        accessToken: "accessToken",
        refreshToken: {},
      };

      // Act & Assert
      expect(() => new NewAuthentication(payload)).toThrowError(
        "NEW_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION",
      );
    });
  });
});
