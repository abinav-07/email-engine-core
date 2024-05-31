const { HttpExceptions } = require("../exceptions/httpsExceptions")

const errorHandler = (error, req, res,next) => {
  if (error instanceof HttpExceptions) {
    // If handled error with status code and message was sent from APIs, send them in payload.
    return res.status(error.getStatusCode()).json({
      message: error.getMessage(),
    })
  }

  //Log Console
  console.log("here",error)

  // Unhandled errors
  res.status(500).json({
    message: "Unhandle Error Found",
  })
}

module.exports = errorHandler
