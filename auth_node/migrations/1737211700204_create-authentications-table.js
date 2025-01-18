exports.up = (pgm) => {
  // Create the authentications table
  pgm.createTable("authentications", {
    token: {
      type: "TEXT",
      notNull: true,
      primaryKey: true, // Token is unique and acts as the primary key
    },
    created_at: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

exports.down = (pgm) => {
  // Drop the authentications table if rolled back
  pgm.dropTable("authentications");
};
