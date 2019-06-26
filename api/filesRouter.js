const express = require("express");
const filesRouter = express.Router();

const path = require("path");
const fs = require("fs");

filesRouter.get("/avatars", (req, res) => {
  //joining path of directory
  const directoryPath = path.join(__dirname, "../uploads/avatars");
  //passsing directoryPath and callback function
  fs.readdir(directoryPath, function(err, files) {
    //handling error
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    res.send(files);
  });
});

filesRouter.get("/teams", (req, res) => {
  //joining path of directory
  const directoryPath = path.join(__dirname, "../uploads/teams");
  //passsing directoryPath and callback function
  fs.readdir(directoryPath, function(err, files) {
    //handling error
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    res.send(files);
  });
});

filesRouter.get("/avatars/:name", (req, res, next) => {
  var options = {
    root: path.join(__dirname, "../uploads/avatars"),
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true
    }
  };

  var fileName = req.params.name;
  res.sendFile(fileName, options, function(err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent:", fileName);
    }
  });
});

filesRouter.get("/teams/:name", (req, res, next) => {
  var options = {
    root: path.join(__dirname, "../uploads/teams"),
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true
    }
  };

  var fileName = req.params.name;
  res.sendFile(fileName, options, function(err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent:", fileName);
    }
  });
});

module.exports = filesRouter;
