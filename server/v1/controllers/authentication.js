

const jwt = require("jsonwebtoken")
const Joi = require("joi")
const bcrypt = require("bcrypt")
const { ValidationException } = require("../exceptions/httpsExceptions")

const { esclient } = require("../config/config")
const { ESIndices } = require("../constants")
const { responseMapper } = require("../models/mappers")

const jwtSecretKey = `${process.env.JWT_SECRET_KEY}`

/**
 * @api {post} /v1/auth/register Register User
 * @apiName RegisterUser
 * @apiGroup Authentication
 * @apiDescription Register a user
 *
 * @apiParam {String} email The email of the user.
 *
 * @apiParamExample {json} Request Example:
 * {
 *    "email": "test@mailinator.com",
 * }
 *
 * @apiSuccess {Object} user JSON object representing the registered user data.
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *    "user": UserPayload,
 *    "success": true,
 * }
 *
 * @apiError {Object} error Error object if the registration process fails.
 *
 * @apiErrorExample {json} Error Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *    "error": "Registration failed."
 * }
 */
const registerUser = async (req, res, next) => {
  const data = req.body

  // Joi validations
  const schema = Joi.object({
    email: Joi.string().required().email(),
  })

  const validationResult = schema.validate(data, { abortEarly: false })

  try {
    if (validationResult && validationResult.error)
      throw new ValidationException(null, validationResult.error)

    //Hash Password
    const hashedPassword = bcrypt.hashSync(data.password, 10)
    data.password = hashedPassword

    // Adding role for the user manually
    data.role = "User"

    //Remove Confirmed Password from body data
    delete data.confirm_password

    const user = await UsersQueries.getUser({ email: data.email })

    if (user && user.email) throw new ValidationException(null, "User Already Registered!")

    // Create new user
    const registerResponse = await UsersQueries.createUser(data)

    const payload = {
      user_id: registerResponse.id,
      first_name: registerResponse.first_name,
      last_name: registerResponse.last_name,
      email: registerResponse.email,
      role: registerResponse.role,
    }
    // Auth sign in
    const token = jwt.sign(payload, jwtSecretKey)

    res.status(200).json({
      user: payload,
      token,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * @api {post} /v1/auth/login Login User
 * @apiName LoginUser
 * @apiGroup Authentication
 * @apiDescription Log in user
 *
 * @apiParam {String} email Email of the admin.
 * @apiParam {String} password Password of the admin.
 *
 * @apiParamExample {json} Request Example:
 * {
 *    "email": "test@mailinator.com",
 *    "password": "Test@123"
 * }
 *
 * @apiSuccess {Object} user JSON object representing the user data.
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *    "user": UserPayload,
 *    "success": true,
 * }
 *
 * @apiError {Object} error Error object if the login process fails.
 *
 * @apiErrorExample {json} Error Response:
 * HTTP/1.1 401 Unauthorized
 * {
 *    "error": "Auth error."
 * }
 */
const loginUser = async (req, res, next) => {
  const data = req.body

  // Joi validation
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  })

  const validationResult = schema.validate(data, { abortEarly: false })

  try {
    if (validationResult && validationResult.error)
      throw new ValidationException(null, validationResult.error)

    // Check if user exists
    const user = responseMapper(await esclient.search({
      index:ESIndices.User,
      size: 1,
      body: {
        query: {
          match: {
            email: data?.email,
          },
        },
      },
    }))[0]
    

    if (!user || !user.email) throw new ValidationException(null, "User Not Registered")

    if (user && user.password && !bcrypt.compareSync(data.password, user.password))
      throw new ValidationException(null, "Password did not match")

    const payload = {
      user_id: user.id,
      name:user?.name,
      email: user.email,
      role: user.role,
    }

    // Auth sign in
    const token = jwt.sign(payload, jwtSecretKey)

    res.status(200).json({
      user: payload,
      token,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  registerUser,
  loginUser,
}
