const express = require("express")
const { checkAdmin, checkJWTToken } = require("../middlewares/auth/checkJWT")

const router = express.Router()

//Services
const UserControllers = require("../controllers/admin/users")
const EmailContollers = require("../controllers/admin/features")

router.use(checkJWTToken, checkAdmin)
// User Routes
router.get("/members", UserControllers.getAll)
router.patch("/members/update", UserControllers.update)

// Email Features routes
router.get("/emails", EmailContollers.getAll)

module.exports = router
