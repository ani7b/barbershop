const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (
    (username === "admin" && password === "admin") ||
    (username === "ani" && password === "ani")
  ) {
    res.redirect("/rezervim");
  } else {
    res.redirect("/login");
  }
});
module.exports = router;
