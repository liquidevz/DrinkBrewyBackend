// eslint-disable-next-line no-undef
const express = require("express");
const router = express.Router();
// eslint-disable-next-line no-undef
const search = require("../controllers/search");

router.post("/search", search.Search);
// eslint-disable-next-line no-undef
module.exports = router;
