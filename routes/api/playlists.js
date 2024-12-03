const express = require("express");
const router = express.Router();
const playlistController = require("../../controllers/playlistController");

router.post("/", playlistController.createPlaylist);
router.get("/", playlistController.getAllPlaylists);
router.post("/follow", playlistController.toggleFollowPlaylist);
router.get("/names", playlistController.getAllPlaylistNamesOfUser);

module.exports = router;
