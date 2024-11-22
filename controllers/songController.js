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

        // Create new playlist if playlistName is provided
        if (playlistName) {
            const playlist = await Playlist.create({
                title: playlistName,
                creator: artistId,
                creatorName: artistName,
                artwork: playlistArtwork || undefined,
                description: description || undefined,
                songs: [
                    {
                        songId: song._id,
                        title: song.title,
                        artistName: song.artistName,
                        artwork: song.artwork,
                    },
                ],
            });

            // Update user's playlist array
            await User.findByIdAndUpdate(artistId, {
                $push: { myPlaylists: playlist._id },
            });

            // Update song's playlist array
            await Song.findByIdAndUpdate(song._id, {
                $push: {
                    playlists: {
                        playlistId: playlist._id,
                        playlistName: playlist.title,
                    },
                },
            });

            return res.status(201).json({
                success: true,
                song,
                playlist,
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

const getSongsByArtist = async (req, res) => {
    try {
        const songs = await Song.find({
            artistName: new RegExp(req.params.artistName, "i"),
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

const getSongsByPlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findOne({
            title: new RegExp(req.params.playlistName, "i"),
        }).populate("songs.songId");

        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: "Playlist not found",
            });
        }

        res.json({
            success: true,
            songs: playlist.songs,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

module.exports = { createSong, getSongsByArtist, getSongsByPlaylist };
