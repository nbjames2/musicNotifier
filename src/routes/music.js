const express = require("express");
const router = express.Router();
const validation = require("./validation");
const musicController = require("../controllers/musicController");

router.post("/music/search", validation.validateSearch, musicController.searchArtist);
router.get("/music/artistview/:id", musicController.viewArtist);
router.get("/music/addfavourite/:id", musicController.addFollowing);
router.get("/music/album/:albumId", musicController.getAlbum);

module.exports = router;