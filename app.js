const http = require("http")
const path = require("path")
const express = require("express")
const { connect, disconnect } = require("./utils/db")
require("dotenv").config()
const adminRoute = require("./routes/admin")
const mainRoute = require("./routes/main")
const { corsHeader } = require("./cors/cors")
require("dotenv/config")

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 5000

connect()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(corsHeader)
app.use(express.static(path.join(__dirname, "views/public")))
app.use(`${process.env.API}`, adminRoute)
app.use(`${process.env.API}`, mainRoute)
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html")
})

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
