const path = require("path")
const { Users } = require("../schemas/users")
const { Banished } = require("../schemas/banish")
const { Room } = require("../schemas/rooms")

const {
  passValidation,
  setMaintained,
  removeFromDB,
  getDBData,
  setDBData,
} = require("../models/admin")
const { postData } = require("../utils/postData")
const uPath = "./storage/users.json"
const toUPath = path.join(__dirname, "../storage/users.json")
const url = "https://vebbo.me"

async function maintenance(req, res) {
  try {
    const pass = req.body.password
    passValidation(pass)
      .then(() => {
        setMaintained()
          .then((result) => {
            res.status(200).json({
              result,
              success: true,
            })
          })
          .catch((err) => {
            res.status(500).json({
              err,
              success: false,
            })
          })
      })
      .catch((err) => {
        res.status(403).json({
          err,
          success: false,
        })
      })
  } catch (err) {
    console.log(err)
  }
}

async function validate(req, res) {
  try {
    const pass = req.body.password
    passValidation(pass)
      .then(() => {
        res.status(200).json({
          result: "Validated!",
          success: true,
        })
      })
      .catch((err) => {
        res.status(403).json({
          err: err,
          success: false,
        })
      })
  } catch (err) {
    console.log(err)
  }
}

async function removeUser(req, res) {
  try {
    const phone = req.body.phone
    const pass = req.body.password
    passValidation(pass)
      .then(() => {
        removeFromDB(Users, Banished, Room, phone)
          .then(() => {
            res.status(200).json({ msg: "User removed", success: true })
          })
          .catch((err) => {
            res.status(401).json({ err, success: false })
          })
      })
      .catch((err) => {
        res.status(403).json({
          err: err,
          success: false,
        })
      })
  } catch (err) {
    console.log(err)
  }
}

async function toJSON(req, res) {
  try {
    const pass = req.body.password
    passValidation(pass)
      .then(() => {
        getDBData(Users)
          .then((result) => {
            res.status(200).json({
              result: result,
              success: true,
            })
          })
          .catch((err) => {
            res.status(500).json({
              err,
              success: false,
            })
          })
      })
      .catch((err) => {
        res.status(403).json({
          err: err,
          success: false,
        })
      })
  } catch (err) {
    console.log(err)
  }
}

async function toDB(req, res) {
  try {
    const fileJSON = req.body.doc
    const pass = req.body.password
    passValidation(pass)
      .then(() => {
        setDBData(Users, fileJSON)
          .then((result) => {
            res.status(201).json({
              data: result,
              success: true,
            })
          })
          .catch((err) => {
            res.status(500).json({
              err,
              success: false,
            })
          })
      })
      .catch((err) => {
        res.status(403).json({
          err: err,
          success: false,
        })
      })
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  maintenance,
  removeUser,
  validate,
  toJSON,
  toDB,
}
