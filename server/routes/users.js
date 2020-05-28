const express = require("express");
const router = express.Router();
const db = require("../utils/db");

const bcrypt = require("bcryptjs");
const saltRounds = 10;

// Register a new user
router.post("/new", (req, res) => {
  console.log("server: users new")
  let user = req.body.user;
  let encrypt = user.password;
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(encrypt, salt, function (err, hash) {
      // Store hash in your password DB.
      user.password = hash;
      db.createOne("users", user).then((user) => {
        res.send(user);
      });
    });
  });
});

module.exports = router;
