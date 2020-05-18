const express = require("express");
const cors = require("cors");
const session = require("express-session");
const sec = require("../config/secret");
const mw = require("../auth/auth-restriction");

const server = express();

//Router
const userRouter = require("../users/userRoutes");
const authRouter = require("../auth/authRoutes");

server.use(express.json());
server.use(cors());
server.use(session(sec.sessionConfig));

// Endpoint routers
server.use("/api/", userRouter);
server.use("/api/users", mw.protected, authRouter);

//Base url endpoint(s)
server.get("/", (req, res) => {
  res.send(
    `<h1>User Viewer starts here</h1><h2>Navigate to</h2> <h3>/api </h3> to continue `
  );
});

module.exports = server;
