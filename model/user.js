const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  googleId: {
    type: String,
    required: true
  },
  token: {
    type: String
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  photoURL: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("User", userSchema);
