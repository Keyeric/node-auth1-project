exports.seed = function (knex) {
  return knex("users")
    .truncate()
    .then(function () {
      return knex("users").insert([
        {
          username: "Deku",
          password: "AruMaito",
        },
        {
          username: "Ichigo",
          password: "Rukia",
        },
      ]);
    });
};
