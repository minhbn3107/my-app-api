const Song = require("../models/Song");
const Playlist = require("../models/Playlist");
const User = require("../models/User");

const search = async (req, res) => {
    try {
        const { query, type } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
            });
        }

        const searchResults = {};

        if (!type || type === "songs") {
            searchResults.songs = await Song.find({
                $or: [
                    { title: new RegExp(query, "i") },
                    { artistName: new RegExp(query, "i") },
                ],
            }).limit(10);
        }

        if (!type || type === "playlists") {
            searchResults.playlists = await Playlist.find({
                $or: [
                    { title: new RegExp(query, "i") },
                    { creatorName: new RegExp(query, "i") },
                ],
                isPublic: true,
            }).limit(10);
        }

        if (!type || type === "artists") {
            searchResults.artists = await User.find({
                $or: [{ displayName: new RegExp(query, "i") }],
                isArtist: true,
            })
                .select("displayName imageURL")
                .limit(10);
        }

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
