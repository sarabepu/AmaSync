const express = require("express");
const router = express.Router();
const db = require("../utils/db");

// Register a new user
router.post("/new", (req, res) => {
  let user = req.body.user;
  db.createOne("users", user).then((user) => {
    res.send(user);
  });
});

module.exports = router;
