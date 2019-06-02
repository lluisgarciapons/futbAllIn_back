const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const matchSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  teamId1: {
    type: String,
    required: true
  },
  teamId2: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Match", matchSchema);
