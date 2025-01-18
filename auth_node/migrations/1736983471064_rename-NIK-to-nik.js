exports.up = (pgm) => {
  pgm.renameColumn("users", "NIK", "nik");
};

exports.down = (pgm) => {
  pgm.renameColumn("users", "nik", "NIK");
};
