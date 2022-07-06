const mongoose = require("mongoose")

const banished = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  when: {
    type: Date,
    default: Date.now(),
  },
})

const Banished = mongoose.model("Banished", banished)
module.exports = {
  Banished,
}
