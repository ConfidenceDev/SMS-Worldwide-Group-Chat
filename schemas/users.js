const mongoose = require("mongoose")

const users = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  tokens: {
    type: Number,
    required: true,
    default: 0,
  },
  boughtAt: {
    type: Date,
    default: Date.now(),
  },
  paused: {
    type: Boolean,
    default: false,
  },
})

const Users = mongoose.model("Users", users)
module.exports = {
  Users,
}
