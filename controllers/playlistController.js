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

const getAllPlaylistNames = async (req, res) => {
    try {
        const playlists = await Playlist.find({}, "title");
        res.json({
            success: true,
            playlists: playlists.map((p) => p.title),
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

module.exports = { createPlaylist, getAllPlaylistNames };
