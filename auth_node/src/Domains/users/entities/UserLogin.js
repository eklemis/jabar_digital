class UserLogin {
  constructor(payload) {
    this._verifyPayload(payload);
    const { nik, password } = payload;
    this.nik = nik;
    this.password = password;
  }

  _verifyPayload({ nik, password }) {
    if (!nik || !password) {
      throw new Error("USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof nik !== "string" || typeof password !== "string") {
      throw new Error("USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = UserLogin;
