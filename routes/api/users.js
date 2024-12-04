const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/usersController");

router.get("/", usersController.getAllUsers);
router.delete("/", usersController.deleteUser);
router.get("/:id", usersController.getUser);
router.patch("/", usersController.toggleBeArtist);
router.get("/liked/:id", usersController.getLikedSongsOfUser);
router.post("/follow", usersController.toggleFollowUser);

module.exports = router;
