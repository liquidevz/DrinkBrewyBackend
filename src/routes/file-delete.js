const express = require("express");
const router = express.Router();
const delete_fileController = require("../controllers/file-delete");
router.delete("/delete-file", delete_fileController.deleteFile);

module.exports = router;
