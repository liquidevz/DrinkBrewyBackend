const express = require("express")
const router = express.Router()
const newsletter = require("../controllers/newsletter")

// Import verifyToken function
const verifyToken = require("../config/jwt")

router.get("/admin/newsletters", verifyToken, newsletter.getNewsletters)

// User routes

router.post("/newsletters", newsletter.createNewsletter) // Add token verification middleware

module.exports = router
