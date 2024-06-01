const HTTPSTATUSCODES = Object.freeze({
  OK: 200,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
  VALIDATION_ERROR: 422,
})

const EMAILSERVICES = Object.freeze({
  GMAIL: "gmail",
  OUTLOOK: "outlook",
})

const ESIndices = Object.freeze({
  User: "users",
  Emails: "emails",
  Mailboxes: "mailboxes",
})

module.exports = {
  HTTPSTATUSCODES,
  EMAILSERVICES,
  ESIndices,
}
