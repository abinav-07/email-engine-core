const { Client } = require("@elastic/elasticsearch")
const {
  ELASTIC_USERNAME,
  ELASTIC_PASSWORD,
  OUTLOOK_CLIENT_ID,
  OUTLOOK_CLIENT_SECRET,
  OUTLOOK_REDIRECT_URI,
} = process.env

const elasticUrl = process.env.ELASTIC_URL || "http://localhost:9200"
const esclient = new Client({
  node: elasticUrl,
  auth: {
    username: ELASTIC_USERNAME,
    password: ELASTIC_PASSWORD,
  },
})
const outlook = {
  clientId: process.env.OUTLOOK_CLIENT_ID,
  clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
  redirectUri: process.env.OUTLOOK_REDIRECT_URI,
}

module.exports = {
  esclient,
  outlook,
}
