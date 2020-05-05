const express = require("express");
const cors = require("cors");
const session = require("express-session");

const server = express();

const sessionConfig = {
  name: "Key",
  secret: process.env.SECRET || "Dont tell nobody",
  cookie: {
    maxAge: 1000 * 60 * 5,
    secure: process.env.SECURE || false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,
};

//Router
const userRouter = require("../users/userRoutes");
const authRouter = require("../auth/authRoutes");

server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

// Endpoint routers
server.use("/api/", userRouter);
server.use("/api/users", protected, authRouter);

//Base url endpoint(s)
server.get("/", (req, res) => {
  res.send(
    `<h1>User Viewer starts here</h1><h2>Navigate to</h2> <h3>/api </h3> to continue `
  );
});

server.get("/admin", (req, res) => {
  req.session.user = {
    Name: "Admin",
    Anime: "Real Life",
    Ability: "Ban Hammer",
    Personality: "God",
  };
  res.json(req.session.user);
});

function protected(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ mesage: `You! shall not! pass!!` });
  }
}

module.exports = server;
