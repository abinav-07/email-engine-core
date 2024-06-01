const config = require("../../config/config")
const { BadRequestException } = require("../../exceptions/httpsExceptions")
const { default: axios } = require("axios")
const { EMAILSERVICES, ESIndices } = require("../../enums")

class OutlookProvider {
  constructor() {
    this.redirectUri = config.emailConfigs.outlook.redirectUri
    this.clientId = config.emailConfigs.outlook.clientId
    this.clientSecret = config.emailConfigs.outlook.clientSecret
  }

  getAuthUrl(localUserId, returnUrl = "/admin/login") {
    const redirectUri = encodeURIComponent(`${this.redirectUri}`)
    const scopes = encodeURIComponent("https://graph.microsoft.com/.default")
    const state = encodeURIComponent(
      JSON.stringify({ localUserId, returnUrl, from: EMAILSERVICES.OUTLOOK }),
    )

    return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}&state=${state}`
  }

  async getAccessToken(code) {
    try {
      const tokenEndpoint = "https://login.microsoftonline.com/common/oauth2/v2.0/token"
      const params = {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: this.redirectUri,
      }

      // Send a POST request to the token endpoint with the authorization code and other parameters
      const response = await axios.post(tokenEndpoint, new URLSearchParams(params))

      // Extract the access token from the response
      const accessToken = response.data.access_token

      const userData = await axios.get(`https://graph.microsoft.com/v1.0/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      // Return the user profile data and access token from the response
      return { userData: userData.data, accessToken }
    } catch (error) {
      console.log("Access Token Err", error?.response?.data)
      throw new BadRequestException(null, "Failed to get access token for outlook")
    }
  }

  async getMailboxes(accessToken) {
    try {
      const response = await axios.get("https://graph.microsoft.com/v1.0/me/mailFolders", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return response.data.value
    } catch (error) {
      console.log("Fetch Mailbox Err", error?.response?.data)
      throw new BadRequestException(null, "Failed to fetch outlook mailboxes")
    }
  }

  async getEmails(accessToken) {
    try {
      const response = await axios.get(`https://graph.microsoft.com/v1.0/me/messages`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return response.data.value
    } catch (error) {
      console.log("Fetch Email Err", error?.response?.data)
      throw new BadRequestException(null, "Failed to fetch outlook emails")
    }
  }

  mapMailBoxesAndEmails(mailboxes, emails, localUserId) {
    // Making both email and mail boxes type of child-parent table like in SQL.
    const bulkMailBody = []
    mailboxes.forEach((mailbox) => {
      bulkMailBody.push({ index: { _index: ESIndices.Mailboxes, _id: mailbox.id } })
      bulkMailBody.push({ ...mailbox, local_user_id: localUserId })

      const mailboxEmails = emails.filter((email) => email.parentFolderId === mailbox.id)
      mailboxEmails.forEach((email) => {
        bulkMailBody.push({
          index: { _index: ESIndices.Emails, _id: email.id, routing: mailbox.id },
        })
        bulkMailBody.push({ ...email, local_user_id: localUserId })
      })
    })

    return bulkMailBody
  }
}

module.exports = new OutlookProvider()
