const express = require("express");
const router = express.Router();
const songController = require("../../controllers/songController");

router.post("/", songController.createSong);
router.get("/artist/:artistID", songController.getSongsOfArtist);
router.get("/playlist/:playlistID", songController.getSongsOfPlaylist);

module.exports = router;
