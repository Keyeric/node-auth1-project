const express = require("express");
const bcrypt = require("bcryptjs");

const func = require("./userModel");

const router = express.Router();

router.get("/", (req, res) => {
  res.send(
    `<h1>Navigate to</h1> <h2>/register</h2> <h2>/login</h2> <h2>/users</h2>`
  );
});

router.post("/register", (req, res) => {
  const body = req.body;

  const hash = bcrypt.hashSync(body.password, 13);
  body.password = hash;

  if (body.username && body.password) {
    func
      .register(body)
      .then((newUser) => {
        res.status(201).json(newUser);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: "server error creating a new user",
          error: error,
        });
      });
  } else {
    res.status(400).json({ message: `Please add a name and password` });
  }
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;
  req.session.username = username;
  console.log(req.session.username);

  func
    .findBy({ username })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.status(200).json({
          message: `Welcome ${user.username}! Login successful! Navigate to /users`,
        });
      } else {
        res.status(401).json({ message: `Invalid Credentials` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.get("/logout", (req, res) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        res.json("error logging out");
      } else {
        res.status(200).json("Logout successful! Have a nice day! ❤️");
      }
    });
  } else {
    res.status(200).json("You were not logged in!!");
  }
});

module.exports = router;
