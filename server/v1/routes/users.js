const express = require("express")

const router = express.Router()

//Services
const AuthenticationServices = require("../controllers/authentication")

// Authentication routes
router.post("/auth/register", AuthenticationServices.registerUser)
router.post("/auth/login", AuthenticationServices.loginUser)

module.exports = router
