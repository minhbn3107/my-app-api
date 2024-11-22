const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const songSchema = new Schema(
    {
        url: {
            type: String,
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        mainVoiceGender: {
            type: String,
            enum: ["male", "female"],
            require: true,
        },
        language: [
            {
                type: String,
                required: true,
                trim: true,
            },
        ],
        genre: [
            {
                type: String,
                required: true,
                trim: true,
            },
        ],
        artist: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        artistName: {
            type: String,
            required: true,
        },
        artwork: {
            type: String,
            required: true,
            default: "https://i.ibb.co/njPK5kh/unknown-track.png",
        },
        playlists: [
            {
                playlistId: {
                    type: Schema.Types.ObjectId,
                    ref: "Playlist",
                },
                playlistName: String,
            },
        ],
        likes: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

songSchema.index({ title: 1, artistName: 1 });
songSchema.index({ artist: 1 });

module.exports = mongoose.model("Song", songSchema);
