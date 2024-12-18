const { sendVerificationEmail } = require("../config/node-mailer");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const getAllUsers = async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(204).json({ message: "No users found" });
    res.json(users);
};

const deleteUser = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ message: "User ID required" });
    }

    const user = await User.findOne({ _id: req.body.id }).exec();
    if (!user)
        return res
            .status(204)
            .json({ message: `User ID ${req.body.id} not found` });

    const result = await user.deleteOne({ _id: req.body.id });
    res.json(result);
};

const getUser = async (req, res) => {
    if (!req?.params?.id)
        return res.status(400).json({ message: "User ID required" });
    const user = await User.findOne({ _id: req.params.id });

    if (!user)
        return res
            .status(204)
            .json({ message: `User ID ${req.params.id} not found` });

    res.json(user);
};

const toggleBeArtist = async (req, res) => {
    if (!req?.body?.id)
        return res.status(400).json({ message: "User ID required" });

    const user = await User.findOne({ _id: req.body.id });

    if (!user)
        return res
            .status(204)
            .json({ message: `User ID ${req.body.id} not found)` });

    user.isArtist = !user.isArtist;

    await user.save();

    res.json(user);
};

const getLikedSongsOfUser = async (req, res) => {
    if (!req?.params?.id || req?.params?.id === null)
        return res.status(400).json({ message: "User ID required" });

    const user = await User.findOne({ _id: req.params.id });

    if (!user) return res.status(204).json({ message: "User not found" });

    const likedSongs = user.likedSongs;

    res.json(likedSongs);
};

const toggleFollowUser = async (req, res) => {
    try {
        if (!req.body.followID)
            return res.status(400).json({ message: "Follow User ID required" });

        const followUserId = req.body.followID;

        const followUser = await User.findById(followUserId);
        if (!followUser)
            return res
                .status(404)
                .json({ message: `User ID ${followUserId} not found` });

        const currentUserId = req?.body?.id;

        const isFollowing = followUser.followers.some(
            (follower) => follower.userId.toString() === currentUserId
        );

        if (isFollowing) {
            followUser.followers = followUser.followers.filter(
                (follower) => follower.userId.toString() !== currentUserId
            );

            await followUser.save();

            return res.status(200).json({
                message: `Unfollowed ${followUser.username}`,
            });
        } else {
            followUser.followers.push({
                userId: currentUserId,
                username: req.body.username,
            });

            await followUser.save();

            return res.status(200).json({
                message: `Followed ${followUser.username}`,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", error });
    }
};

const sendResetPasswordEmail = async (req, res) => {
    try {
        if (!req?.body?.email)
            return res.status(400).json({ message: "Email required" });

        const email = req.body.email;

        const user = await User.findOne({ email: email });

        if (!user)
            return res
                .status(404)
                .json({ message: "User not found with email" });

        await sendVerificationEmail(email, req.body.token);

        res.json({ message: "Email sent" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        if (!req?.body?.email)
            return res.status(400).json({ message: "Email required" });

        if (!req?.body?.newPassword)
            return res.status(400).json({ message: "New Password required" });

        const email = req.body.email;
        const pwd = req.body.newPassword;

        const user = await User.findOne({ email: email });

        user.password = await bcrypt.hash(pwd, 10);

        const updatedUser = await user.save();

        res.status(201).json({ success: `New password updated!`, updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUsers,
    deleteUser,
    getUser,
    toggleFollowUser,
    getLikedSongsOfUser,
    toggleBeArtist,
    sendResetPasswordEmail,
    resetPassword,
};
