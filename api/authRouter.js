const express = require("express");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");

const keys = require("../config/keys");

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

authRouter.get("/logout", (req, res) => {
  req.logout();
});

authRouter.get(
  "/google/redirect",
  passport.authenticate("google"),
  (req, res) => {
    let token = jwt.sign({ id: req.user._id }, keys.session.cookieKey, {
      expiresIn: "24h"
    });
    res.redirect(`http://localhost:8080/login?code=${token}`);
  }
);

module.exports = authRouter;
