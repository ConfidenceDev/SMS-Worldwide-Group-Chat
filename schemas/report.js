const mongoose = require("mongoose")

const report = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  by: {
    type: String,
    required: true,
  },
  when: {
    type: Date,
    default: Date.now(),
  },
})

const Report = mongoose.model("Report", report)
module.exports = {
  Report,
}
