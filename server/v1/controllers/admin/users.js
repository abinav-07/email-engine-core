const Joi = require("joi")
const bcrypt = require("bcrypt")
const { Op } = require("sequelize")
const { ValidationException } = require("../../exceptions/httpsExceptions")

//Queries
const UserQueries = require("../../queries/users")

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
    const getAll = await UserQueries.getAll({ include: { all: true, separate: true } })

    res.status(200).json(getAll)
  } catch (err) {
    next(err)
  }
}

/**
 * @api {patch} /v1/admin/member/update Update User
 * @apiName UpdateUser
 * @apiGroup Admin Users
 * @apiDescription Update user
 *
 * @apiParam {String} first_name The updated first name of the user.
 * @apiParam {String} last_name The updated last name of the user.
 * @apiParam {String} email The updated email of the user.
 * @apiParam {String} role Role type
 *
 * @apiParamExample {json} Request Example:
 * {
 *    "first_name": "Test",
 *    "last_name": "Me",
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
    first_name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    email: Joi.string().required().email(),
    role: Joi.string().optional(),
  })

  const validationResult = schema.validate(data, { abortEarly: false })

  try {
    if (validationResult && validationResult.error)
      throw new ValidationException(null, validationResult.error)

    // Check if user exists in our DB
    const checkUser = await UserQueries.getUser({ email: data?.email })

    if (!checkUser) throw new ValidationException(null, "User not found!")

    // Check if email already exists
    const user = await UserQueries.getUser({ email: data.email, id: { [Op.ne]: checkUser?.id } })

    // Check if email already exists
    if (user && user.email && checkUser.email !== data.email)
      throw new ValidationException(null, "Email Already Exists!")

    // Update user
    await UserQueries.updateUser(checkUser?.id, data)

    res.status(200).json({
      success: true,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * @api {delete} /v1/admin/member/delete Delete User
 * @apiName DeleteUser
 * @apiGroup Admin Users
 * @apiDescription Delete currently logged in user
 *
 * @apiSuccess {Object} Returns the JSON object representing the success message.
 *
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true
 *     }
 *
 * @apiError {Object} error Error object if the deletion process fails.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Err message."
 *     }
 */
const deleteOne = async (req, res, next) => {
  try {
    // Get autheticated user from our req payload, set in JWT
    const { user_id } = req.user

    // Check if user exists in our DB
    const checkUser = await UserQueries.getUser({ id: user_id })

    if (!checkUser) throw new ValidationException(null, "User not found!")

    // Delete User
    await UserQueries.deleteUser(user_id)

    const payload = {
      success: true,
    }

    res.status(200).json(payload)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getAll,
  update,
  deleteOne,
}
