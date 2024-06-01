

const jwt = require("jsonwebtoken")
const Joi = require("joi")
const bcrypt = require("bcrypt")
const { ValidationException } = require("../exceptions/httpsExceptions")

const { esclient } = require("../config/config")
const { ESIndices, EMAILSERVICES } = require("../enums")
const { responseMapper } = require("../models/mappers")
const { randomUUID } = require("crypto")
const OutlookProvider = require("../services/email/outlookProvider")
const outlookProvider = require("../services/email/outlookProvider")

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
    // Adding role for the user manually

    data.role = "User"
    data.created_at=new Date()

  // Check if user exists
  const user = responseMapper(await esclient.search({
    index:ESIndices.User,
    size: 1,
    body: {
      query: {
        term: {
          email: data?.email,
        },
      },
    },
  }))[0]

    if (user && user.email) throw new ValidationException(null, "User Already Registered!")

    const localId = randomUUID();
    //Hash Password
    const hashedPassword = bcrypt.hashSync(data.password, 10)
    data.password = hashedPassword

    delete data.confirm_password


    // Create new user
     await esclient.index({
      index:ESIndices.User,
      type:"_doc",
      id:localId,
      body:{
        ...data
      }
    })

    const oauthUrl=OutlookProvider.getAuthUrl(localId, req.headers.referer)

    // Redirect to Outlook authentication
    res.status(200).json({oauthUrl});
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

const callbackUrl = async (req, res, next) => {
  const data = req.body

  // Joi validation
  const schema = Joi.object({
    code: Joi.string().required(),
    state: Joi.object().required(),
  })

  const validationResult = schema.validate(data, { abortEarly: false })
  try {

    if (validationResult && validationResult.error)
      throw new ValidationException(null, validationResult.error)
  
     // Extract the authorization code and start from the query parameters
     const {code,state} = data;
     let userData;
     let emailServiceUserId;
    
    //  GET USER DATA and do anything with it now.
  if(state.from==EMAILSERVICES.OUTLOOK){
    //  Get user data using the code 
     userData=await outlookProvider.getAccessToken(code);
     emailServiceUserId=userData.id
  }

  // Some data transformation shenanigans
  delete userData.id
  userData.service_user_id=emailServiceUserId

await esclient.update({
  index:ESIndices.User,
  id: state.localUserId,
  body:{
    doc:{
      ...userData
    }
  }
})
    

    res.status(200).json({message:"Successfull Outlook setup"})
  } catch (err) {
    next(err)
  }
}



module.exports = {
  registerUser,
  loginUser,
  callbackUrl,
}
