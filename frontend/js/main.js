const url = `https://vebbo.herokuapp.com/`

fetch(`${url}api/v1/users`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((result) => {
    const value = toComma(result.result)
    if (value == 1) {
      usersCount.innerText = `${value} User`
    } else {
      usersCount.innerText = `${value} Users`
    }
  })
  .catch((err) => {
    console.log(err)
  })

fetch(`${url}api/v1/notice`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((result) => {
    if (result.result) {
      notice.innerText = result.msg
    }
  })
  .catch((err) => {
    console.log(err)
  })

updateCountry()
codeList.addEventListener("change", () => {
  updateCountry()
})

function updateCountry() {
  const val = codeList.options[codeList.selectedIndex].text
  const codeArr = val.split(" (")
  countryField.value = codeArr[0]
}

createBtn.addEventListener("click", (e) => {
  e.preventDefault()
  const phone = phoneField.value.trim()
  const username = usernameField.value
  const email = emailField.value
  const country = countryField.value

  const val = codeList.options[codeList.selectedIndex].text
  const codeArr = val.split(" (")
  const code = codeArr[1].slice(0, -1)

  if (!phone || !username || !email || !country) {
    showMsg("A field might be empty!")
    return
  }

  if (phone.startsWith("+") || isNaN(phone)) {
    showMsg(`Use actual phone number without: "+" and country code`)
    return
  }

  const doc = {
    phone: `${code}${phone}`,
    username: username,
    email: email,
    country: countryField.value,
  }

  fetch(`${url}api/v1/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(doc),
  })
    .then((response) => response.json())
    .then((result) => {
      if (!result.success) {
        showMsg(result.msg)
        return
      }
      phoneField.value = null
      usernameField.value = null
      emailField.value = null
      countryField.value = null
      showMsg("Account registered successfully!")
    })
    .catch((err) => {
      console.log(err)
    })
})

proceedBtn.addEventListener("click", (e) => {
  e.preventDefault()
  const tokens = tokensField.value
  const phone = activatePhoneField.value
  const email = activateEmailField.value

  if (!tokens || !phone || !email) {
    showMsg("A field might be empty!")
    return
  }

  if (isNaN(tokens)) {
    showMsg("Enter the number of tokens you want")
    return
  }

  const doc = {
    phone: phone,
  }

  fetch(`${url}api/v1/check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(doc),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.msg) {
        showMsg(result.data)
        return
      } else {
        const naira = result.naira ? result.naira : 15
        const amt = parseInt(tokens) * naira
        credit(email, amt)
      }
    })
    .catch((err) => {
      console.log(err)
    })
})

function credit(email, amt) {
  const handler = PaystackPop.setup({
    key: payHash(),
    email: email,
    amount: `${amt}00`,
    callback: (response) => {
      if (response.status == "success") {
        const tokens = tokensField.value
        const phone = activatePhoneField.value
        const doc = {
          tokens: parseInt(tokens),
          phone: phone,
        }

        fetch(`${url}api/v1/paid`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(doc),
        })
          .then((response) => response.json())
          .then((result) => {
            tokensField.value = null
            activatePhoneField.value = null
            activateEmailField.value = null
            showMsg(result.msg)
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        showMsg("Something went wrong try again")
      }
    },
    onClose: function () {
      showMsg("Transaction cancelled")
    },
  })
  handler.openIframe()
}
