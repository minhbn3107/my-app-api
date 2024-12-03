const Song = require("../models/Song");
const Playlist = require("../models/Playlist");
const User = require("../models/User");

const search = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
            });
        }

        searchResults = {};

        searchResults.songs = await Song.find({
            $or: [
                { title: new RegExp(query, "i") },
                { artistName: new RegExp(query, "i") },
            ],
        }).limit(10);

        searchResults.playlists = await Playlist.find({
            $or: [
                { title: new RegExp(query, "i") },
                { creatorName: new RegExp(query, "i") },
            ],
            isPublic: true,
        }).limit(10);

        searchResults.artists = await User.find({
            $or: [
                { displayName: new RegExp(query, "i") },
                { username: new RegExp(query, "i") },
            ],
            isArtist: true,
        }).limit(10);

        res.json({
            success: true,
            results: searchResults,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

module.exports = { search };
