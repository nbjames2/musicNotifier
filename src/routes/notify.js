const express = require("express");
const router = express.Router();
const notifyController = require("../controllers/notifyController");

router.get("/music/new", notifyController.checkNew);

module.exports = router;
