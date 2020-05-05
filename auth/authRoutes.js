const express = require("express");

const func = require("../users/userModel");

const router = express.Router();

router.get("/", (req, res) => {
  func
    .find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "Server error retrieving the list of users." });
    });
});

module.exports = router;
