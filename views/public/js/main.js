const btns = document.querySelector(".btns")
const remove = document.querySelector(".remove")
const validation = document.querySelector(".validation")
const passBtn = document.querySelector("#passBtn")
const uploadBtn = document.getElementById("upload")
const downloadBtn = document.getElementById("download")
const removeBtn = document.getElementById("removeBtn")
const usersCount = document.getElementById("usersCount")
const phoneField = document.getElementById("phone_field")
const passField = document.getElementById("pass_field")
const maintenanceBtn = document.getElementById("maintenanceBtn")

const url = "https://vebbo.herokuapp.com/api/v1"
//const url = "http://xxxxxxxxx:xxxx/api/v1"

fetch(`${url}/users`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((result) => {
    usersCount.innerText = `${toComma(result.result)} Users`
  })
  .catch((err) => {
    console.log(err)
  })

passBtn.addEventListener("click", (e) => {
  e.preventDefault()
  const content = passField.value
  if (content === undefined || content === null || content === "") {
    alert("Field is empty!")
    return
  }

  const doc = {
    password: content,
  }

  fetch(`${url}/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(doc),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        btns.style = "display: flex;"
        remove.style = "display: flex;"
        validation.style = "display: none;"
        passField.disabled = true
      } else {
        alert("Wrong Password!")
      }
    })
    .catch((err) => {
      console.log(err)
    })
})

maintenanceBtn.addEventListener("click", (e) => {
  e.preventDefault()
  const content = passField.value

  const doc = {
    password: content,
  }

  fetch(`${url}/maintenance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(doc),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result)
      alert(`Maintained: ${result.result}`)
    })
    .catch((err) => {
      console.log(err)
    })
})

removeBtn.addEventListener("click", (e) => {
  e.preventDefault()
  const content = phoneField.value
  const password = passField.value
  if (content === undefined || content === null || content === "") {
    alert("Field is empty!")
    return
  }

  const doc = {
    phone: content,
    password: password,
  }

  fetch(`${url}/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(doc),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result)
      phoneField.value = null
      alert(result.msg)
    })
    .catch((err) => {
      console.log(err)
    })
})

downloadBtn.addEventListener("click", (e) => {
  e.preventDefault()
  const password = passField.value
  const doc = {
    password: password,
  }

  fetch(`${url}/download`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(doc),
  })
    .then((response) => response.json())
    .then((result) => {
      const link = document.createElement("a")
      const file = new Blob([JSON.stringify(result.result)], {
        type: "text/plain",
      })
      link.href = URL.createObjectURL(file)
      link.download = "users.json"
      link.click()
    })
    .catch((err) => {
      console.log(err)
    })
})

uploadBtn.addEventListener("click", (e) => {
  e.preventDefault()
  const inputElement = document.createElement("input")
  inputElement.id = "file"
  inputElement.type = "file"
  inputElement.accept = `.json, application/json, text.json`
  inputElement.click()
  inputElement.onchange = (event) => {
    const file = inputElement.files[0]
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = function (e) {
      const password = passField.value
      const fileJSON = {
        doc: reader.result,
        password: password,
      }
      fetch(`${url}/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: fileJSON,
      })
        .then((response) => response.json())
        .then((success) => {
          console.log(success)
          alert(success.data)
        })
        .catch((error) => console.log(error))
    }
  }
})

function toComma(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
