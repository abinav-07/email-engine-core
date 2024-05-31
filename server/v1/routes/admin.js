const express = require("express")
const { checkAdmin, checkJWTToken } = require("../middlewares/auth/checkJWT")

const router = express.Router()

//Services
const UserServices = require("../controllers/admin/users")
const PageServices = require("../controllers/admin/features")


// Public route
router.post("/pages/create", PageServices.create)

router.use(checkJWTToken, checkAdmin)
// User Routes
router.get("/members", UserServices.getAll)
router.patch("/member/update", UserServices.update)
router.delete("/member/delete", UserServices.deleteOne)

// Page Features routes
router.get("/pages", PageServices.getAll)
router.delete("/pages/:page_id/delete", PageServices.deleteOne)

module.exports = router
