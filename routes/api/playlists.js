const express = require("express");
const router = express.Router();
const playlistController = require("../../controllers/playlistController");

router.post("/", playlistController.createPlaylist);
router.get("/names", playlistController.getAllPlaylistNames);

module.exports = router;
