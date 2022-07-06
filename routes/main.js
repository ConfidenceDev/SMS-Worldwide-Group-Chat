const router = require("express").Router()
const {
  message,
  register,
  paid,
  check,
  users,
  notice,
  sendMsg,
} = require("../controllers/main")

//===================== INCOMING =================================
router.get("/users", (req, res) => {
  users(req, res)
})

router.get("/notice", (req, res) => {
  notice(req, res)
})

router.post("/message", (req, res) => {
  const { From, Body } = req.body
  message(From, Body, res)
  //sendMsg(["+2348022656777"], "Hello, World! from Telnyx", res)
  res.status(200).end()
})

router.post("/register", (req, res) => {
  register(req, res)
})

router.post("/check", (req, res) => {
  check(req, res)
})

router.patch("/paid", (req, res) => {
  paid(req, res)
})

module.exports = router
