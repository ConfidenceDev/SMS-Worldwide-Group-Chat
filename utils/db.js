const mongoose = require("mongoose")

const connect = async () => {
  try {
    await mongoose
      .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Database connected...")
      })
      .catch((err) => {
        console.log("Error: " + err)
      })
  } catch (error) {
    console.log(error)
  }
}

const disconnect = () => {
  return mongoose.disconnect()
}

module.exports = {
  connect,
  disconnect,
}
