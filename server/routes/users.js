const express = require("express");
const router = express.Router();
const db = require("../utils/db");

const bcrypt = require("bcrypt");
const saltRounds = 10;

// Register a new user
router.post("/new", (req, res) => {
  let user = req.body.user;
  let encrypt = user.password;
  bcrypt
    .hash(encrypt, saltRounds)
    .then((hash) => {
      user.password = hash;
      return user;
    })
    .then((user) => {
      db.createOne("users", user).then((user) => {
        res.send(user);
      });
    });
});

module.exports = router;
