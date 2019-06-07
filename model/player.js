const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playerSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  teamId: {
    type: String
  },
  userId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("Player", playerSchema);
