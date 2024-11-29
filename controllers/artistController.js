const User = require("../models/User");

const getAllArtist = async (req, res) => {
    try {
        const artists = await User.find({ isArtist: true });

        res.json({
            success: true,
            artists: artists,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

module.exports = { getAllArtist };
