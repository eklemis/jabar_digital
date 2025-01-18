exports.up = (pgm) => {
  pgm.createTable("users", {
    id: "id", // Auto-incrementing primary key
    NIK: { type: "text", notNull: true, unique: true },
    role: { type: "text", notNull: true },
    password: { type: "text", notNull: true },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("users");
};
