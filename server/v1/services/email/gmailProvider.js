const config = require('../../config/config');

class GmailProvider  {
  constructor() {
    this.redirectUri=config.emailConfigs.gmail.redirectUri
    this.clientId=config.emailConfigs.gmail.clientId
    this.clientSecret=config.emailConfigs.gmail.clientSecret
  }
}

module.exports = new GmailProvider();