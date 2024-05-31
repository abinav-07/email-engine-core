const axios = require("axios")
const config = require("../config")

exports.getUserData = async (token) => {
  const response = await axios.get("https://graph.microsoft.com/v1.0/me", {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

exports.syncEmails = async (token) => {
  const response = await axios.get("https://graph.microsoft.com/v1.0/me/messages", {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data.value
}
