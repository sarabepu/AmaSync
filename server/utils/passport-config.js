const passport = require("passport");
const session = require("express-session");
const Strategy = require("passport-local").Strategy;
const db = require("./db");

const bcrypt = require("bcryptjs");

passport.use(
  new Strategy(function (username, password, cb) {
    db.findOne("users", { username: username }).then((user) => {
      if (user) {
        bcrypt.compare(password, user.password).then(function (result) {
          // result == true
          if (result) {
            console.log("Right password");
            cb(null, user);
          } else {
            console.log("Wrong password");
            cb(null, false);
          }
        });
      } else {
        console.log("Username doesn't exist");
        cb(new Error("Username doesn't exist"));
      }
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.username);
});

passport.deserializeUser(function (username, done) {
  db.findOne("users", { username: username }).then((user) => {
    if (user) {
      done(null, user);
    } else {
      console.log("User not found");
      done(new Error("User doesn't exist"));
    }
  });
});

const configurePassport = (app) => {
  app.use(
    session({
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: false,
    })
  );

  // Initialize Passport and restore authentication state, if any, from the
  // session.
  app.use(passport.initialize());
  app.use(passport.session());
};

module.exports = configurePassport;
