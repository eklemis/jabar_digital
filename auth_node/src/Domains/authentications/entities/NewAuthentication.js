class NewAuthentication {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, nik, role, accessToken, refreshToken } = payload;
    this.id = id;
    this.nik = nik;
    this.role = role;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  _verifyPayload({ id, nik, role, accessToken, refreshToken }) {
    if (!id || !nik || !role || !accessToken || !refreshToken) {
      throw new Error("NEW_AUTHENTICATION:NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "number" ||
      typeof nik !== "string" ||
      typeof role !== "string" ||
      typeof accessToken !== "string" ||
      typeof refreshToken !== "string"
    ) {
      throw new Error("NEW_AUTHENTICATION:NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = NewAuthentication;
