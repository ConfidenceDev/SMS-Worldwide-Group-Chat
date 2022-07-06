const { write } = require("../utils/write")
let Maintenance = require("../data/maintenance.json")

const mPath = "./data/maintenance.json"
const url = "https://vebbo.me"

async function getTokens(Users, phone, num) {
  try {
    return new Promise(async (resolve, reject) => {
      Users.find({ phone })
        .then(async (item) => {
          if (item.length > 0) {
            if (item[0].tokens >= num) {
              item[0].tokens = parseInt(item[0].tokens) - num
              await Users.findOneAndUpdate(item[0]._id, item[0], {
                new: true,
                useFindAndModify: false,
              })
              resolve(item[0])
            } else {
              reject("Not enough tokens!")
            }
          } else {
            reject("No user found!")
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  } catch (err) {
    console.log(err)
  }
}

async function checkTokens(Users, phone, num, isMsg) {
  try {
    return new Promise(async (resolve, reject) => {
      Users.find({})
        .then(async (items) => {
          const item = []
          for (let i = 0; i < items.length; i++) {
            if (items[i].phone === phone) {
              item[0] = items[i]
            }
          }

          if (item.length > 0) {
            if (item[0].tokens >= num) {
              const size = num > items.length ? items.length - 1 : num

              if (items.length > 1 || !isMsg) {
                item[0].tokens = parseInt(item[0].tokens) - size

                await Users.findOneAndUpdate(item[0]._id, item[0], {
                  new: true,
                  useFindAndModify: false,
                })
              }
              resolve(item[0])
            } else {
              reject("Not enough tokens!")
            }
          } else {
            reject("No user found!")
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  } catch (err) {
    console.log(err)
  }
}

async function checkPaused(Users, phone) {
  try {
    return new Promise(async (resolve, reject) => {
      const item = await Users.find({ phone })
      if (item.length > 0) {
        resolve(item[0].paused)
      } else {
        reject()
      }
    })
  } catch (err) {
    console.log(err)
  }
}

async function checkExisting(Users, obj) {
  try {
    return new Promise(async (resolve, reject) => {
      const item = await Users.find({ phone: obj.phone })
      if (item.length > 0) {
        resolve("A user with this phone number already exists!")
      } else {
        const name = await Users.find({ username: obj.username })
        if (name.length > 0) {
          resolve("Username is taken, try a different name!")
        } else {
          reject()
        }
      }
    })
  } catch (err) {
    console.log(err)
  }
}

async function createUser(Users, Banished, Room, obj) {
  try {
    return new Promise(async (resolve, reject) => {
      const item = await Banished.find({ phone: obj.phone })
      if (item.length > 0) {
        reject("This phone number cannot be used!")
      } else {
        obj.tokens = 0
        obj.boughtAt = Date.now()
        new Users(obj)
          .save()
          .then(async (result) => {
            Room.find({})
              .then(async (categories) => {
                let i = 0
                while (i < categories.length) {
                  const category = categories[i]
                  const start = "Welcome"
                  if (category.room === start) {
                    const newSet = category.users
                    newSet.push(result.phone)
                    const newData = {
                      users: newSet,
                    }

                    await Room.findOneAndUpdate(category._id, newData, {
                      new: true,
                      useFindAndModify: false,
                    })
                    result.room = category.room
                    result.topic = category.topic
                    resolve(result)
                    break
                  }
                  i++
                }
              })
              .catch((err) => {
                console.log(err)
                reject("Something went wrong, try again!")
              })
          })
          .catch((err) => {
            reject(err)
          })
      }
    })
  } catch (err) {
    console.log(err)
  }
}

async function checkUser(Users, Banished, obj) {
  try {
    return new Promise(async (resolve, reject) => {
      Banished.find({ phone: obj.phone })
        .then((item) => {
          if (item.length > 0) {
            const doc = {
              msg: true,
              data: "This phone number cannot be used!",
            }

            resolve(doc)
            return
          }
          Users.find({ phone: obj.phone })
            .then((item) => {
              if (item.length < 1) {
                const doc = {
                  msg: true,
                  data: "No account found for this user!",
                }
                resolve(doc)
                return
              }
              const doc = {
                msg: false,
              }
              resolve(doc)
            })
            .catch((err) => {
              reject(err)
            })
        })
        .catch((err) => {
          reject(err)
        })
    })
  } catch (err) {
    console.log(err)
  }
}

async function updateTokens(Users, obj) {
  try {
    return new Promise(async (resolve, reject) => {
      await Users.findOne({ phone: obj.phone }).then(async (user) => {
        if (user) {
          obj.tokens = parseInt(user.tokens) + parseInt(obj.tokens)
          obj.boughtAt = Date.now()
          await Users.findOneAndUpdate(user._id, obj, {
            new: true,
            useFindAndModify: false,
          })
            .then((item) => {
              resolve(
                `Tokens added successfully, new token amount: ${item.tokens}`
              )
            })
            .catch((err) => {
              reject(err)
            })
        } else {
          reject("No user found!")
        }
      })
    })
  } catch (err) {
    console.log(err)
  }
}

async function updatePaused(Users, phone, key) {
  try {
    return new Promise(async (resolve, reject) => {
      Users.find({ phone })
        .then(async (item) => {
          if (item.length > 0) {
            if (
              (item[0].paused && key !== "pause") ||
              (!item[0].paused && key === "pause")
            ) {
              const doc = key === "pause" ? true : false
              item[0].paused = doc
              await Users.findOneAndUpdate(item[0]._id, item[0], {
                new: true,
                useFindAndModify: false,
              })
            }
            resolve()
          } else {
            reject("No user found!")
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  } catch (err) {
    console.log(err)
  }
}

async function getUsers(Users) {
  try {
    return new Promise((resolve, reject) => {
      Users.find({})
        .then((result) => {
          resolve(result)
        })
        .catch((err) => {
          reject(err)
        })
    })
  } catch (err) {
    console.log(err)
  }
}

async function getMaintained() {
  return new Promise((resolve) => {
    resolve(Maintenance[0].isMaintained)
  })
}

async function getRoomUsers(Room, phone) {
  try {
    return new Promise(async (resolve, reject) => {
      Room.find({})
        .then(async (categories) => {
          let i = 0
          while (i < categories.length) {
            const category = categories[i]
            let exist = false
            for (let j = 0; j < category.users.length; j++) {
              if (phone === category.users[j]) {
                exist = true
              }
            }

            if (exist) {
              resolve(categories[i].users)
              break
            }
            i++
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  } catch (error) {
    console.log(error)
  }
}

async function getTopic(Room, phone) {
  try {
    return new Promise(async (resolve, reject) => {
      Room.find({})
        .then(async (categories) => {
          let i = 0
          while (i < categories.length) {
            const category = categories[i]
            let exist = false
            for (let j = 0; j < category.users.length; j++) {
              if (phone === category.users[j]) {
                exist = true
              }
            }

            if (exist) {
              resolve(categories[i].topic)
              break
            }
            i++
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  } catch (error) {
    console.log(error)
  }
}

async function setTopic(Room, obj) {
  try {
    return new Promise(async (resolve, reject) => {
      Room.find({})
        .then(async (categories) => {
          let i = 0
          while (i < categories.length) {
            const category = categories[i]
            let exist = false
            for (let j = 0; j < category.users.length; j++) {
              if (obj.phone === category.users[j]) {
                exist = true
              }
            }

            if (exist) {
              const newData = {
                topic: obj.topic,
              }
              await Room.findOneAndUpdate(categories[i]._id, newData, {
                new: true,
                useFindAndModify: false,
              })
              resolve()
              break
            }
            i++
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  } catch (error) {
    console.log(error)
  }
}

async function addReport(Report, phone, obj) {
  try {
    return new Promise((resolve, reject) => {
      const newData = {
        name: obj,
        by: phone,
        when: Date.now(),
      }
      new Report(newData)
        .save()
        .then((result) => {
          resolve(result)
        })
        .catch((err) => {
          reject(err)
        })
      resolve()
    })
  } catch (err) {
    console.log(err)
  }
}

async function checkRoom(Room, phone) {
  try {
    return new Promise(async (resolve, reject) => {
      Room.find({})
        .then(async (categories) => {
          let i = 0
          while (i < categories.length) {
            categories[i].users.forEach(async (item, index) => {
              if (phone === item) {
                categories[i].users.splice(index, 1)
                const newData = {
                  users: categories[i].users,
                }

                Room.updateOne({ _id: categories[i]._id }, newData, {
                  new: true,
                  useFindAndModify: false,
                })
                  .then(() => {
                    resolve()
                  })
                  .catch((err) => {
                    reject(err)
                  })
              }
            })
            i++
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  } catch (err) {
    console.log(err)
  }
}

async function joinRoom(Room, phone, obj) {
  try {
    return new Promise(async (resolve, reject) => {
      const initObj = obj.initCap().toString()
      Room.find({ room: initObj })
        .then(async (room) => {
          room[0].users.push(phone)
          const newData = {
            users: room[0].users,
          }

          Room.updateOne({ _id: room[0]._id }, newData, {
            new: true,
            useFindAndModify: false,
          })
            .then(() => {
              const doc = {
                room: `You joined ${room[0].room} room`,
                members: toComma(room[0].users.length),
                topic: room[0].topic,
              }
              resolve(doc)
            })
            .catch((err) => {
              reject(err)
            })
        })
        .catch((err) => {
          reject(err)
        })
    })
  } catch (err) {
    console.log(err)
  }
}

async function isBanished(Banished, phone) {
  try {
    return new Promise((resolve, reject) => {
      Banished.find({ phone })
        .then((data) => {
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  } catch (err) {
    console.log(err)
  }
}

String.prototype.initCap = function () {
  return this.toLowerCase().replace(/(?:^|\s)[a-z]/g, function (m) {
    return m.toUpperCase()
  })
}

function toComma(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

module.exports = {
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
}
