const express = require("express");
const router = express.Router();
const artistController = require("../../controllers/artistController");

router.get("/", artistController.getAllArtist);

module.exports = router;
