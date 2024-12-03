const Playlist = require("../models/Playlist");
const User = require("../models/User");

const createPlaylist = async (req, res) => {
    try {
        const {
            title,
            creatorId,
            creatorName,
            isPublic,
            description,
            artwork,
            songs, // Array of song IDs
        } = req.body;

        if (!title || !creatorId || !creatorName) {
            return res.status(400).json({
                success: false,
                message: "Required fields: title, creatorId, creatorName",
            });
        }

        const playlist = await Playlist.create({
            title,
            creator: creatorId,
            creatorName,
            isPublic,
            description,
            artwork: artwork || undefined,
            songs: songs || [],
        });

        // Update user's playlist array
        await User.findByIdAndUpdate(creatorId, {
            $push: { myPlaylists: playlist._id },
        });

        res.status(201).json({
            success: true,
            playlist,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const getAllPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find({ isPublic: true });

        res.json({
            success: true,
            playlists: playlists,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const getAllPlaylistNamesOfUser = async (req, res) => {
    try {
        const { userId } = req.query;

        const playlists = await Playlist.find({ creator: userId }, "title");
        res.json({
            success: true,
            playlists: playlists.map((playlist) => playlist.title),
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const toggleFollowPlaylist = async (req, res) => {
    try {
        if (!req.body.followID)
            return res
                .status(400)
                .json({ message: "Follow Playlist ID required" });

        const followPlaylistId = req.body.followID;

        const followPlaylist = await Playlist.findById(followPlaylistId);
        if (!followPlaylistId)
            return res
                .status(404)
                .json({ message: `Playlist ID ${followPlaylistId} not found` });

        const currentUserId = req?.body?.id;

        const isFollowing = followPlaylist.followers.some(
            (follower) => follower.userId.toString() === currentUserId
        );

        if (isFollowing) {
            followPlaylist.followers = followPlaylist.followers.filter(
                (follower) => follower.userId.toString() !== currentUserId
            );

            await followPlaylist.save();

            return res.status(200).json({
                message: `Unfollowed ${followPlaylist.title}`,
            });
        } else {
            followPlaylist.followers.push({
                userId: currentUserId,
                username: req.body.username,
            });

            await followPlaylist.save();

            return res.status(200).json({
                message: `Followed ${followPlaylist.title}`,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", error });
    }
};

module.exports = {
    createPlaylist,
    getAllPlaylists,
    getAllPlaylistNamesOfUser,
    toggleFollowPlaylist,
};
