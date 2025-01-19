class UserLogin {
  constructor(payload) {
    this._verifyPayload(payload);
    const { nik, password } = payload;
    this.nik = nik;
    this.password = password;
  }

  _verifyPayload({ nik, password }) {
    if (!nik || !password) {
      throw new Error("USER_ENTITY:NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof nik !== "string" ||
      typeof password !== "string" ||
      !/^\d{16}$/.test(nik)
    ) {
      throw new Error("USER_ENTITY:NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = UserLogin;
