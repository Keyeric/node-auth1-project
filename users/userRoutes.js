const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const func = require("./userModel");
const sec = require("../config/secret");

const router = express.Router();

router.get("/", (req, res) => {
  res.send(
    `<h1>Navigate to</h1> <h2>/register</h2> <h2>/login</h2> <h2>/users</h2>`
  );
});

router.post("/register", (req, res) => {
  const credentials = req.body;
  console.log("req body", req.body);
  console.log("\n unval creds \n", credentials);
  func
    .findBy(credentials.username)
    .then((body) => {
      if (!body[0]) {
        if (
          credentials.username &&
          credentials.password &&
          typeof credentials.password === "string"
        ) {
          const rounds = process.env.BCRYPT_ROUNDS || 12;
          const hash = bcrypt.hashSync(credentials.password, rounds);
          credentials.password = hash;

          console.log("\n val creds \n", credentials);
          console.log("\n hashpass\n ", credentials.password);
          func
            .register(credentials)
            .then((newUser) => {
              console.log("\n newUser \n", newUser);
              res.status(201).json(newUser);
            })
            .catch((error) => {
              console.log("\n Error \n", error);
            });
        } else {
          res
            .status(400)
            .json({ message: `Please add a name and alphanumeric password` });
        }
      } else {
        res.status(500).json({
          message: "That username is taken, please choose another",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "server error creating a new user",
        error: error,
      });
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;
  req.session.username = username;

  func
    .findBy(username)
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);

        req.session.user = user;
        res.status(200).json({
          message: `Welcome ${user.username}! Login successful! Navigate to /users`,
          token,
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

function generateToken(user) {
  const payload = {
    subject: user.id, //sub property
    username: user.username,
    //....other data
  };
  const options = {
    expiresIn: "5m",
  };
  return jwt.sign(payload, sec.jwtSecret, options);
}

module.exports = router;
