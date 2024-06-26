const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const chalk = require("chalk")
const path = require("path")
const http = require("http")

dotenv.config({ path: path.resolve(__dirname, "./.env") })

//  Services
const { NotFoundException } = require("./exceptions/httpsExceptions")
const errorHandler = require("./middlewares/errorHandler")
const init = require("./models")
const { initializeSocket } = require("./services/socket")
const { rateLimiter } = require("./middlewares/rateLimitter")

//Initialize With Express
const app = express()

//Express Body Parser
app.use(express.json())

//Extendend false to run a simple algorithm for basic parsing
app.use(express.urlencoded({ extended: false }))

//CORS
app.use(cors())
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
})

app.use(rateLimiter)

// Init Elastic Search
init()

//Routes
app.use("/v1", require("./routes/users"))
app.use("/v1/admin", require("./routes/admin"))

//Error Handler
app.use((req, res, next) =>
  next(new NotFoundException(null, `404 Not found: ${req.url} does not exist`)),
)

require("./services/crons/emailCron")

app.use(errorHandler)

// Initializing Socket to communicate cron notifications
const server = http.createServer(app)
initializeSocket(server)

server.listen(process.env.NODE_PORT || 5000, () => {
  console.log(chalk.blue(`Server started on ${process.env.NODE_PORT || 5000}!`))
})
