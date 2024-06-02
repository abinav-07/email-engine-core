const { esclient } = require("../../config/config")
const { ESIndices } = require("../../enums")
const { responseMapper } = require("../../models/mappers")

/**
 * @api {get} /v1/admin/emails Get All Emails
 * @apiName GetAll
 * @apiGroup Pages
 * @apiDescription Get All Emails with child table
 *
 *
 * @apiParamExample {json} Request Example:
 * {
 *    "emails": EmailPayload
 * }
 *
 * @apiSuccess {Object} Success message
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *    "emails": EmailPayload
 * }
 *
 * @apiError {Object} error Error object if the update process fails.
 *
 * @apiErrorExample {json} Error Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *    "error": "Error message"
 * }
 */

const getAll = async (req, res, next) => {
  try {
    // Fetch all user documents
    const usersResponse = responseMapper(
      await esclient.search({
        index: ESIndices.User,
        // _source: ["id","name", "email", "role", "created_at"],
        body: {
          query: {
            bool: {
              must: [{ match_all: {} }],
              must_not: [{ term: { "email.keyword": "admin@gmail.com" } }],
            },
          },
        },
      }),
    )

    const userIds = usersResponse.map((user) => user.id)

    const mailboxesResponse = responseMapper(
      await esclient.search({
        index: ESIndices.Mailboxes,
        body: {
          query: {
            terms: {
              "local_user_id.keyword": userIds,
            },
          },
        },
      }),
    )

    const emailsResponse = responseMapper(
      await esclient.search({
        index: ESIndices.Emails,
        body: {
          query: {
            terms: {
              "local_user_id.keyword": userIds,
            },
          },
        },
      }),
    )

    const usersWithChildren = usersResponse.map((user) => {
      user.mailboxes = mailboxesResponse.filter((mailbox) => mailbox.local_user_id === user.id)
      user.emails = emailsResponse.filter((email) => email.local_user_id === user.id)
      return user
    })

    res.status(200).json(usersWithChildren)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getAll,
}
