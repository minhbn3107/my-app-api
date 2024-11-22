const express = require("express");
const router = express.Router();
const songController = require("../../controllers/songController");

router.post("/", songController.createSong);
router.get("/artist/:artistName", songController.getSongsByArtist);
router.get("/playlist/:playlistName", songController.getSongsByPlaylist);

module.exports = router;
