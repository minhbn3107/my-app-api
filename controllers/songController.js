const Song = require("../models/Song");
const Playlist = require("../models/Playlist");
const User = require("../models/User");

const createSong = async (req, res) => {
    try {
        const {
            url,
            title,
            mainVoiceGender,
            language,
            genre,
            artistId,
            artistName,
            artwork,
            playlistName,
            playlistArtwork,
            description,
        } = req.body;

        // Validation
        if (
            !url ||
            !title ||
            !mainVoiceGender ||
            !language ||
            !genre ||
            !artistId ||
            !artistName
        ) {
            return res.status(400).json({
                message:
                    "Required fields: url, title, mainVoiceGender, language, genre, artistId, artistName",
            });
        }

        // Create song
        const song = await Song.create({
            url,
            title,
            mainVoiceGender,
            language,
            genre,
            artist: artistId,
            artistName,
            artwork: artwork || undefined,
        });

        // Handle playlist creation/addition
        if (playlistName) {
            // Check if a playlist with the same name already exists for the user
            let playlist = await Playlist.findOne({
                title: playlistName,
                creator: artistId,
            });

            // If playlist doesn't exist, create a new one
            if (!playlist) {
                playlist = await Playlist.create({
                    title: playlistName,
                    creator: artistId,
                    creatorName: artistName,
                    artwork: playlistArtwork || undefined,
                    description: description || undefined,
                    songs: [],
                });

                // Update user's playlist array
                await User.findByIdAndUpdate(artistId, {
                    $push: { myPlaylists: playlist._id },
                });
            }

            // Check if song is already in the playlist
            const songExistsInPlaylist = playlist.songs.some(
                (songItem) => songItem.songId.toString() === song._id.toString()
            );

            // Add song to playlist if not already present
            if (!songExistsInPlaylist) {
                playlist.songs.push({
                    songId: song._id,
                    title: song.title,
                    artistName: song.artistName,
                    artwork: song.artwork,
                });
                await playlist.save();

                // Update song's playlist array
                await Song.findByIdAndUpdate(song._id, {
                    $push: {
                        playlists: {
                            playlistId: playlist._id,
                            playlistName: playlist.title,
                        },
                    },
                });
            }

            return res.status(201).json({
                success: true,
                song,
                playlist,
                message: songExistsInPlaylist
                    ? "Song already exists in the playlist"
                    : "Song added to playlist",
            });
        }

        res.status(201).json({
            success: true,
            song,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const getSongsOfArtist = async (req, res) => {
    try {
        const artistID = req.params.artistID;
        console.log(artistID);

        const songs = await Song.find({
            artist: artistID,
        });

        if (!songs.length) {
            return res.status(404).json({
                success: false,
                message: "No songs found for this artist",
            });
        }

        res.json({
            success: true,
            songs,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const getSongsOfPlaylist = async (req, res) => {
    try {
        const playlistID = req.params.playlistID;

        const songs = await Song.find({
            "playlists.playlistId": playlistID,
        }).exec();

        if (!songs.length) {
            return res.status(404).json({
                success: false,
                message: "No songs found for this playlist",
            });
        }

        res.json({
            success: true,
            songs,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const getNewestSongs = async (req, res) => {
    try {
        const songs = await Song.find().sort({ createdAt: -1 }).limit(3).exec();

        if (!songs.length) {
            return res.status(404).json({
                success: false,
                message: "No songs found",
            });
        }

        res.json({
            success: true,
            songs,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const toggleLikeSong = async (req, res) => {
    try {
        const { userId, songId } = req.body;

        // Validate input
        if (!userId || !songId) {
            return res.status(400).json({
                message: "User ID and Song ID are required",
            });
        }

        // Find the song
        const song = await Song.findById(songId);
        if (!song) {
            return res.status(404).json({ message: "Song not found" });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the song is already liked by the user
        const isLiked = user.likedSongs.includes(songId);

        if (isLiked) {
            // Unlike the song
            await User.findByIdAndUpdate(userId, {
                $pull: { likedSongs: songId },
            });

            // Decrement likes count
            const updatedSong = await Song.findByIdAndUpdate(
                songId,
                { $inc: { likes: -1 } },
                { new: true } // Return the updated document
            );

            res.status(200).json({
                message: `User ${user.displayName} unliked Song ${updatedSong.title}`,
                isLiked: false,
                likes: updatedSong.likes,
            });
        } else {
            // Like the song
            await User.findByIdAndUpdate(userId, {
                $addToSet: { likedSongs: songId },
            });

            // Increment likes count
            const updatedSong = await Song.findByIdAndUpdate(
                songId,
                { $inc: { likes: 1 } },
                { new: true } // Return the updated document
            );

            res.status(200).json({
                message: `User ${user.displayName} liked Song ${updatedSong.title}`,
                isLiked: true,
                likes: updatedSong.likes,
            });
        }
    } catch (error) {
        console.error("Error toggling song like:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

module.exports = {
    createSong,
    getSongsOfArtist,
    getSongsOfPlaylist,
    getNewestSongs,
    toggleLikeSong,
};
