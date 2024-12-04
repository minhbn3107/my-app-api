const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/usersController");

router.get("/", usersController.getAllUsers);
router.delete("/", usersController.deleteUser);
router.patch("/", usersController.toggleBeArtist);
router.post("/send-email", usersController.sendResetPasswordEmail);
router.post("/reset-password", usersController.resetPassword);
router.get("/:id", usersController.getUser);
router.get("/liked/:id", usersController.getLikedSongsOfUser);
router.post("/follow", usersController.toggleFollowUser);

module.exports = router;
