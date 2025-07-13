const express = require("express");
const expressSession = require("express-session");
const path = require("node:path");
const pool = require("./db/pool");
const router = require("./routes/router");
const pgSession = require("connect-pg-simple")(expressSession);
const passport = require("./config/passport");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(
  expressSession({
    store: new pgSession({
      pool: pool,
      tableName: "session",
    }),
    secret: "CAT",
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  })
);
app.use(passport.session());
app.use("/", router);
app.listen(3000);
