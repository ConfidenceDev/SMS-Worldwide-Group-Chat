const cors = require("cors")

const corsConfig = {
  origin: [
    "https://vebbo.herokuapp.com/",
    "https://vebbo.me",
    "https://vebbo.me/",
    "https://media-4e717.web.app/",
  ],
  methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
  allowedHeaders: [
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Methods",
    "X-Requested-With",
    "X-Access-Token",
    "Content-Type",
    "Host",
    "Accept",
    "Connection",
    "Cache-Control",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
}

const corsHeader = cors(corsConfig)

module.exports = {
  corsHeader,
}
