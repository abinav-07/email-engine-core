const Joi = require("joi")
const { ValidationException } = require("../../exceptions/httpsExceptions")
const { esclient } = require("../../config/config")
const { ESIndices } = require("../../enums")
const { responseMapper } = require("../../models/mappers")

/**
 * @api {get} /v1/admin/members Get All Users
 * @apiName GetAll
 * @apiGroup Admin Users
 * @apiDescription Get All users with child table
 *
 *
 * @apiParamExample {json} Request Example:
 * {
 *    "members": MembersPayload
 * }
 *
 * @apiSuccess {Object} Success message
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *    "members": MembersPayload
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
    // Get All features with child table data
    const getAll = responseMapper(
      await esclient.search({
        index: ESIndices.User,
        _source: ["name", "email", "role", "created_at","displayName"],
      }),
    )

    res.status(200).json(getAll)
  } catch (err) {
    next(err)
  }
}

/**
 * @api {patch} /v1/admin/members/update Update User
 * @apiName UpdateUser
 * @apiGroup Admin Users
 * @apiDescription Update user
 *
 * @apiParam {String} email The updated email of the user.
 * @apiParam {String} role Role type
 *
 * @apiParamExample {json} Request Example:
 * {
 *    "role": "user",
 *    "email": "test@mailinator.com",
 * }
 *
 * @apiSuccess {Object} Success message
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *    "success": true,
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
const update = async (req, res, next) => {
  // get payload
  const data = req.body

  // Joi validations
  const schema = Joi.object({
    email: Joi.string().required().email(),
    role: Joi.string().optional(),
  })

  const validationResult = schema.validate(data, { abortEarly: false })

  try {
    if (validationResult && validationResult.error)
      throw new ValidationException(null, validationResult.error)

    // Check if user exists in our DB
    const checkUser = responseMapper(
      await esclient.search({
        index: ESIndices.User,
        size: 1,
        body: {
          query: {
            term: {
              "email.keyword": data?.email,
            },
          },
        },
      }),
    )[0]

    if (!checkUser) throw new ValidationException(null, "User not found!")

    // Update user
    await esclient.update({
      index:ESIndices.User,
      id:checkUser.id,
      body: {
        doc: {
          ...checkUser,
          role:data?.role
        },
      },
    })

    res.status(200).json({
      success: true,
    })
  } catch (err) {
    next(err)
  }
}


module.exports = {
  getAll,
  update,
}
