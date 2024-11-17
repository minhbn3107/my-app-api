const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playlistSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
        artwork: {
            type: String,
            required: true,
            default: "https://i.ibb.co/mczqqHC/The-Unknown-Album-Cover.jpg",
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        creatorName: {
            type: String,
            required: true,
        },
        songs: [
            {
                songId: {
                    type: Schema.Types.ObjectId,
                    ref: "Song",
                },
                title: String,
                artistName: String,
                duration: Number,
                artwork: String,
            },
        ],
        description: {
            type: String,
            maxlength: 500,
            default: "",
        },
        followers: [
            {
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                },
                username: String,
            },
        ],
        songCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

playlistSchema.index({ creator: 1, title: 1 });
playlistSchema.index({ creatorName: 1 });

playlistSchema.pre("save", function (next) {
    if (this.isModified("songs")) {
        this.songCount = this.songs.length;
        this.totalDuration = this.songs.reduce(
            (total, song) => total + (song.duration || 0),
            0
        );
    }
    next();
});

module.exports = mongoose.model("Song", playlistSchema);
