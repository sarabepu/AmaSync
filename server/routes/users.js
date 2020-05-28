const express = require("express");
const router = express.Router();
const db = require("../utils/db");

const bcrypt = require("bcryptjs");
const saltRounds = 10;

// Register a new user
router.post("/new", (req, res) => {
  let user = {
    email: req.body.user.email,
    password: req.body.user.password,
    name: req.body.user.name,
  };
  let encrypt = user.password;
  db.findOne("users", { email: user.email }).then((user) => {
    if (user) {
      res.send({ error: "Email already used" });
    } else {
      bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(encrypt, salt, function (err, hash) {
          // Store hash in your password DB.
          user.password = hash;
          db.createOne("users", user).then((user) => {
            res.send(user);
          });
        });
      });
    }
  });
});

module.exports = router;
