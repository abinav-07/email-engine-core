const { Client } = require("@elastic/elasticsearch")
const {
  ELASTIC_USERNAME,
  ELASTIC_PASSWORD,
  OUTLOOK_CLIENT_ID,
  OUTLOOK_CLIENT_SECRET,
  OUTLOOK_REDIRECT_URI,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
} = process.env

const elasticUrl = process.env.ELASTIC_URL || "http://localhost:9200"
const esclient = new Client({
  node: elasticUrl,
  auth: {
    username: ELASTIC_USERNAME,
    password: ELASTIC_PASSWORD,
  },
})

const emailConfigs = {
  outlook: {
    clientId: OUTLOOK_CLIENT_ID,
    clientSecret: OUTLOOK_CLIENT_SECRET,
    redirectUri: OUTLOOK_REDIRECT_URI,
  },
  gmail: {
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    redirectUri: GOOGLE_REDIRECT_URI,
  },
  // Other IMAP services here
}

module.exports = {
  esclient,
  emailConfigs,
}
