const router = require("express").Router()
const {
  maintenance,
  removeUser,
  validate,
  toJSON,
  toDB,
} = require("../controllers/admin")

const { Users } = require("../schemas/users")
const { Banished } = require("../schemas/banish")

router.post("/maintenance", (req, res) => {
  maintenance(req, res)
})

router.delete("/delete", (req, res) => {
  removeUser(req, res)
})

router.post("/validate", (req, res) => {
  validate(req, res)
})

router.post("/download", async (req, res) => {
  toJSON(req, res)
})

router.post("/upload", async (req, res) => {
  toDB(req, res)
})

router.post("/manage", async (req, res) => {
  //console.log(await Users.find({}))
  //console.log(await Banished.find({}))
  /*Users.deleteMany({ tokens: 25 }, (err, data) => {
    console.log(data)
  })
  /*Banished.deleteMany({ phone: "+2348833987" }, (err, data) => {
    console.log(data)
  })*/
})

module.exports = router
