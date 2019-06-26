const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teamSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20
  },
  short_name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 3
  },
  avatar: {
    type: String,
    required: true
  },
  private: {
    type: Boolean
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("Team", teamSchema);
