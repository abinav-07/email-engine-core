const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

const { UnauthorizedException } = require("../../exceptions/httpsExceptions")
const UserQueries = require("../../queries/users")

//Secret Key
const jwtSecretKey = `${process.env.JWT_SECRET_KEY}`

// Middleware
const checkJWTToken = async (req, res, next) => {
  try {
    // Get token from headers
    let jwtToken = req.headers.authorization

    if (jwtToken.startsWith("Bearer")) {
      jwtToken = jwtToken.split(" ")[1] //Bearer xa2132
    }

    // Decode the token from the header with the token that we signed in during login/register
    const decodedToken = jwt.verify(jwtToken, jwtSecretKey)

    const checkUser = await UserQueries.getUser({ id: decodedToken?.user_id })

    if (!checkUser) {
      throw new UnauthorizedException(null, "Unauthorized User")
    }

    req.user = checkUser
    // Call next middleware if all is good
    next()
  } catch (err) {
    // Throw err
    next(new UnauthorizedException(null, "Invalid JWT Token"))
  }
}

const checkAdmin = (req, res, next) => {
  try {
    const { user } = req
    if (user.role != "Admin") {
      throw new UnauthorizedException(null, "Unauthorized User")
    }
    next()
  } catch (err) {
    // Throw err
    next(new UnauthorizedException(null, "Invalid Admin"))
  }
}

module.exports = {
  checkJWTToken,
  checkAdmin,
}
