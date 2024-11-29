const express = require("express");
const router = express.Router();
const playlistController = require("../../controllers/playlistController");

router.post("/", playlistController.createPlaylist);
router.get("/", playlistController.getAllPlaylists);
router.get("/names-of-user", playlistController.getAllPlaylistNamesOfUser);

module.exports = router;
