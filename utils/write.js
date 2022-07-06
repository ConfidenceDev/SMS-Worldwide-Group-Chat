const fs = require("fs")

async function write(path, file) {
  try {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, JSON.stringify(file), "utf8", (err) => {
        if (!err) {
          resolve()
        } else {
          reject(err)
        }
      })
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  write,
}
