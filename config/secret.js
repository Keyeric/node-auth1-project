module.exports = {
  jwtSecret:
    process.env.JWT_SECRET || "Secure secret oiufgheoruhfgourhviorhgiou",

  sessionConfig: {
    name: "Key",
    secret: process.env.SECRET || "Dont tell nobody",
    cookie: {
      maxAge: 1000 * 60 * 5,
      secure: process.env.SECURE || false,
      httpOnly: true,
    },
    resave: false,
    saveUninitialized: process.env.ALLOWED_COOKIES || false,
  },
};
