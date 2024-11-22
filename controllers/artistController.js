const User = require("../models/User");

const getAllArtistNames = async (req, res) => {
    try {
        const artists = await User.find({ isArtist: true }, "displayName");

        res.json({
            success: true,
            artists: artists.map((a) => a.displayName),
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

module.exports = { getAllArtistNames };
