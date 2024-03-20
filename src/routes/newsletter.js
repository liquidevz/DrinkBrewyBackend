// eslint-disable-next-line no-undef
const express = require("express");
const router = express.Router();
// eslint-disable-next-line no-undef
const newsletter = require("../controllers/newsletter");

// Import verifyToken function
// eslint-disable-next-line no-undef
const verifyToken = require("../config/jwt");

router.get("/admin/newsletters", verifyToken, newsletter.getNewsletters);

// User routes

router.post("/newsletter", newsletter.createNewsletter); // Add token verification middleware
// eslint-disable-next-line no-undef
module.exports = router;
