const mongoose = require("mongoose")

const room = new mongoose.Schema({
  room: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    default: "N/A",
  },
  users: [
    {
      type: String,
      required: false,
    },
  ],
  when: {
    type: Date,
    default: Date.now(),
  },
})

const Room = mongoose.model("Room", room)
module.exports = {
  Room,
}
