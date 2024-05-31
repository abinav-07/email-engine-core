const dotenv = require("dotenv")

const jwt = require("jsonwebtoken")
const Joi = require("joi")
const bcrypt = require("bcrypt")
const { ValidationException } = require("../exceptions/httpsExceptions")

//Queries
const UsersQueries = require("../queries/users")

const jwtSecretKey = `${process.env.JWT_SECRET_KEY}`

/**
 * @api {post} /v1/auth/register Register User
 * @apiName RegisterUser
 * @apiGroup Authentication
 * @apiDescription Register a user
 *
 * @apiParam {String} first_name The first name of the user.
 * @apiParam {String} last_name The last name of the user.
 * @apiParam {String} email The email of the user.
 * @apiParam {String} password The password of the user.
 * @apiParam {String} confirm_password The confirmation of the password.
 *
 * @apiParamExample {json} Request Example:
 * {
 *    "first_name": "Test",
 *    "last_name": "Me",
 *    "email": "test@mailinator.com",
 *    "password": "Test@123",
 *    "confirm_password": "Test@123"
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
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string()
      .required()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,20})"))
      .messages({
        "string.pattern.base": "Password must contain alphabets and numbers",
        "string.required": "Password is required",
      }),
    confirm_password: Joi.string().equal(Joi.ref("password")).required().messages({
      "any.only": "Passwords do not match",
      "string.required": "Confirm Password is required",
    }),
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
 * @apiParam {String} email Email of the user.
 * @apiParam {String} password Password of the user.
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
    const user = await UsersQueries.getUser({ email: data.email })

    if (!user || !user.email) throw new ValidationException(null, "User Not Registered")

    if (user && user.password && !bcrypt.compareSync(data.password, user.password))
      throw new ValidationException(null, "Password did not match")

    const payload = {
      user_id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
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
