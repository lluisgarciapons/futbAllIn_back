const express = require("express");
const filesRouter = express.Router();

const path = require("path");
const fs = require("fs");

filesRouter.get("/", (req, res) => {
  //joining path of directory
  const directoryPath = path.join(__dirname, "../uploads");
  //passsing directoryPath and callback function
  fs.readdir(directoryPath, function(err, files) {
    //handling error
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    res.send(files);
  });
});

filesRouter.get("/:name", (req, res, next) => {
  var options = {
    root: path.join(__dirname, "../uploads"),
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
