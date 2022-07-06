const { write } = require("../utils/write")
let Maintenance = require("../data/maintenance.json")

const mPath = "./data/maintenance.json"
const url = "https://vebbo.me"

async function passValidation(pass) {
  try {
    return new Promise((resolve, reject) => {
      if (
        pass !== undefined &&
        pass !== null &&
        pass === process.env.ADMIN_PASS
      ) {
        resolve()
      } else {
        reject("Password is incorrect!")
      }
    })
  } catch (error) {
    console.log(error)
  }
}

async function setMaintained() {
  return new Promise((resolve, reject) => {
    if (Maintenance[0]) {
      const isMaintained = Maintenance[0].isMaintained
      if (isMaintained) {
        Maintenance[0].isMaintained = false
        write(mPath, Maintenance)
        resolve(Maintenance[0].isMaintained)
      } else {
        Maintenance[0].isMaintained = true
        write(mPath, Maintenance)
        resolve(Maintenance[0].isMaintained)
      }
    } else {
      reject("No value for maintenance")
    }
  })
}

async function removeFromDB(Users, Banished, Room, obj) {
  return new Promise((resolve, reject) => {
    Room.find({})
      .then(async (categories) => {
        let i = 0
        while (i < categories.length) {
          const category = categories[i]
          let exist = false
          let pos = 0
          for (let j = 0; j < category.users.length; j++) {
            if (phone === category.users[j]) {
              exist = true
              pos = j
            }
          }

          if (exist) {
            const newData = {
              users: category.users.splice(pos, 1),
            }
            await Room.findOneAndUpdate(category._id, newData, {
              new: true,
              useFindAndModify: false,
            })

            const query = { phone: obj.phone }
            Users.deleteOne(query, (err, data) => {
              if (err) {
                reject(err)
                return
              }

              const newData = {
                phone: obj.phone,
                when: Date.now(),
              }
              new Banished(newData)
                .save()
                .then((result) => {
                  resolve(result)
                })
                .catch((err) => {
                  reject(err)
                })
            })
            break
          }
          i++
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}

async function getDBData(Users) {
  try {
    return new Promise(async (resolve, reject) => {
      const items = await Users.find(
        {},
        {
          _id: 0,
          phone: 1,
          username: 1,
          email: 1,
          country: 1,
          tokens: 1,
          boughtAt: 1,
          paused: 1,
        }
      )
      if (items) {
        resolve(items)
      } else {
        reject(err)
      }
    })
  } catch (error) {
    console.log(error)
  }
}

async function setDBData(Users, data) {
  try {
    return new Promise(async (resolve, reject) => {
      for (let i = 0; i < data.length; i++) {
        new Users(data[i]).save().catch((err) => {
          reject(err)
        })
      }
      resolve("Completed!")
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  passValidation,
  setMaintained,
  removeFromDB,
  getDBData,
  setDBData,
}
