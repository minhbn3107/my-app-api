const express = require("express");
const router = express.Router();
const artistController = require("../../controllers/artistController");

router.get("/names", artistController.getAllArtistNames);

module.exports = router;
