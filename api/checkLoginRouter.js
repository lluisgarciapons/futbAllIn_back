const express = require("express");
const checkLoginRouter = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");

const keys = require("../config/keys");

checkLoginRouter.get("/", (req, res) => {
  res.send(req.user);
});

module.exports = checkLoginRouter;
