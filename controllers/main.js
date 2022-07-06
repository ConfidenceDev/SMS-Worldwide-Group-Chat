const { postData } = require("../utils/postData")
const { Users } = require("../schemas/users")
const { Banished } = require("../schemas/banish")
const { Report } = require("../schemas/report")
const { Room } = require("../schemas/rooms")
const {
  getTokens,
  checkTokens,
  checkPaused,
  checkUser,
  checkExisting,
  createUser,
  updateTokens,
  updatePaused,
  getUsers,
  getRoomUsers,
  getMaintained,
  getTopic,
  setTopic,
  addReport,
  checkRoom,
  joinRoom,
  isBanished,
} = require("../models/main")
const url = "https://vebbo.me"
const telnyx = require("telnyx")(process.env.TELNYX_KEY)

//=========================== CLIENTS =================================
async function message(req, res) {
  try {
    /*const body = await postData(req)
    const obj = JSON.parse(body)
    const phone = obj.From
    const msg = obj.Body*/

    const phone = From
    const msg = Body

    if (await getMaintained()) {
      const number = [phone]
      const note =
        "We are currently in maintenance, we will be back shortly, thanks"
      sendMsg(number, note, res)
      return
    }

    if ((await isBanished(Banished, phone)).length > 0) {
      const number = [phone]
      const note = "You're account has been suspended"
      sendMsg(number, note, res)
      return
    }

    if (msg.toLowerCase() === "pause") {
      getTokens(Users, phone, 1)
        .then(() => {
          updatePaused(Users, phone, msg.toLowerCase())
            .then(() => {
              const number = [phone]
              const note = "Forum feeds has been paused"
              sendMsg(number, note, res)
            })
            .catch((err) => {
              console.log(err)
            })
        })
        .catch((err) => {
          console.log(err)
        })
    } else if (msg.toLowerCase() === "resume") {
      getTokens(Users, phone, 1)
        .then(() => {
          updatePaused(Users, phone, msg.toLowerCase())
            .then(() => {
              const number = [phone]
              const note = "Forum feeds has been resumed"
              sendMsg(number, note, res)
            })
            .catch((err) => {
              console.log(err)
            })
        })
        .catch((err) => {
          console.log(err)
        })
    } else if (msg.toLowerCase() === "tokens") {
      getTokens(Users, phone, 1)
        .then((result) => {
          const number = [phone]
          const val = result.tokens === 1 ? "token" : "tokens"
          const note = `You have ${result.tokens} ${val}`
          sendMsg(number, note, res)
        })
        .catch((err) => {
          console.log(err)
        })
    } else if (msg.toLowerCase() === "discussion") {
      getTokens(Users, phone, 1)
        .then(() => {
          getTopic(Room, phone)
            .then((result) => {
              const number = [phone]
              const note = `Topic: ${result.substr(0, 160)}`
              sendMsg(number, note, res)
            })
            .catch((err) => {
              console.log(err)
            })
        })
        .catch((err) => {
          console.log(err)
        })
    } else if (msg.split(">")[0].toLowerCase().trim() === "report") {
      getTokens(Users, phone, 1)
        .then(() => {
          addReport(Report, phone, msg.split(">")[1].trim())
            .then(() => {
              const number = [phone]
              const note = "Report sent"
              sendMsg(number, note, res)
            })
            .catch((err) => {
              console.log(err)
            })
        })
        .catch((err) => {
          console.log(err)
        })
    } else if (!isNaN(parseInt(msg.split(">")[0].trim()))) {
      msgOtherwise(phone, msg, parseInt(msg.split(">")[0].trim()), false, res)
    } else if (msg.split(">")[0].toLowerCase().trim() === "topic") {
      getRoomUsers(Room, phone)
        .then(async (result) => {
          checkTokens(Users, phone, result.length, false)
            .then(async () => {
              const numbers = []
              const number = [phone]
              for (let i = 0; i < result.length; i++) {
                if (
                  result[i] !== phone &&
                  (await checkPaused(Users, result[i])) === false
                ) {
                  numbers[i] = result[i]
                }
              }

              const tVal = msg.split(">")[1]
              const obj = {
                topic: tVal,
                phone: phone,
              }
              await setTopic(Room, obj)

              if (numbers.length > 0) {
                const topicMsg = tVal.substr(0, 160)
                sendMsg(numbers, topicMsg, res)
              }
              sendMsg(number, "Topic has been updated!", res)
            })
            .catch((err) => {
              console.log(err)
            })
        })
        .catch((err) => {
          console.log(err)
        })
    } else if (msg.split(">")[0].toLowerCase().trim() === "join room") {
      getTokens(Users, phone, 1)
        .then(() => {
          checkRoom(Room, phone)
            .then(() => {
              joinRoom(Room, phone, msg.split(">")[1].trim())
                .then((result) => {
                  const number = [phone]
                  const note = `${result.room}
              Members: ${result.members}
              Topic: ${result.topic.substr(0, 64)}`
                  sendMsg(number, note, res)
                })
                .catch((err) => {
                  console.log(err)
                })
            })
            .catch((err) => {
              console.log(err)
            })
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      msgOtherwise(phone, msg, 0, true, res)
    }
  } catch (err) {
    console.log(err)
  }
}

async function msgOtherwise(phone, msg, num, all, res) {
  getRoomUsers(Room, phone)
    .then((result) => {
      const length = all ? result.length - 1 : num

      checkTokens(Users, phone, length, true)
        .then(async (item) => {
          const numbers = []
          for (let i = 0; i < result.length; i++) {
            if (
              result[i] !== phone &&
              (await checkPaused(Users, result[i])) === false
            ) {
              numbers[i] = result[i]
            }
          }

          if (numbers.length > 0) {
            const msgLength =
              160 -
              (parseInt(item.username.length) + parseInt(item.country.length))
            const note = `${item.username}-${item.country}: ${msg.substr(
              0,
              msgLength
            )}`
            sendMsg(numbers, note, res)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    })
    .catch((err) => {
      console.log(err)
    })
}

async function sendMsg(numbers, msg, res) {
  try {
    Promise.all(
      numbers.map(async (number) => {
        return telnyx.messages.create(
          {
            from: process.env.TELNYX_TRIAL_NUM,
            to: number,
            text: msg,
          },
          function (err, response) {
            console.log(err)
          }
        )
      })
    )
      .then(() => {})
      .catch((err) => {
        console.log(`Send Msg Error: ${err}`)
      })
  } catch (err) {
    console.error(err)
  }
}

async function register(req, res) {
  try {
    const obj = req.body
    checkExisting(Users, obj)
      .then((result) => {
        res.status(400).json({
          msg: result,
          success: false,
        })
      })
      .catch(() => {
        createUser(Users, Banished, Room, obj)
          .then((result) => {
            const broadcast = `WELCOME TO VEBBO FORUM
              Room: ${result.room}
              Topic: ${result.topic}
              Disclaimer:
              1. Keep characters to 160 or less per message
              2. Tokens are needed to broadcast message. 
              You currently have ${result.tokens} tokens.
              3. For reports, tokens, inquires and feedback visit: ${url}`

            const number = [result.phone]
            sendMsg(number, broadcast, res)
            res
              .status(200)
              .json({ data: result, msg: "User created!", success: true })
          })
          .catch((msg) => {
            res.status(400).json({ msg, success: false })
          })
      })
  } catch (err) {
    console.log(err)
  }
}

async function check(req, res) {
  try {
    const obj = req.body

    checkUser(Users, Banished, obj)
      .then((item) => {
        if (item.msg) {
          res.status(200).json({
            msg: item.msg,
            data: item.data,
            success: true,
          })
        } else {
          res.status(200).json({
            msg: item.msg,
            naira: 15,
            success: true,
          })
        }
      })
      .catch((err) => {
        res.status(404).json({ err, success: false })
      })
  } catch (err) {
    console.log(err)
  }
}

async function paid(req, res) {
  try {
    const obj = req.body

    updateTokens(Users, obj)
      .then((item) => {
        res.status(200).json({
          msg: item,
          success: true,
        })
      })
      .catch((err) => {
        res.status(404).json({ err, success: false })
      })
  } catch (err) {
    console.log(err)
  }
}

async function users(req, res) {
  try {
    getUsers(Users)
      .then((result) => {
        res.status(200).json({
          result: result.length,
          success: true,
        })
      })
      .catch((err) => {
        res.status(500).json({
          err,
          success: false,
        })
      })
  } catch (err) {
    console.log(err)
  }
}

async function notice(req, res) {
  try {
    getMaintained().then((result) => {
      res.status(200).json({
        result: result,
        msg: result
          ? "We are currently in maintenance, we will be back shortly, thanks"
          : null,
        success: true,
      })
    })
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  message,
  register,
  paid,
  check,
  users,
  notice,
  sendMsg,
}
