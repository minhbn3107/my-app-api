const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
    },
    imageURL: {
        type: String,
        required: true,
        default: "https://i.ibb.co/WDxgSkK/avatar-icon.png",
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    displayName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    },
    isArtist: {
        type: Boolean,
        default: false,
    },
    likedSongs: [
        {
            type: Schema.Types.ObjectId,
            ref: "Song",
        },
    ],
    myPlaylists: [
        {
            type: Schema.Types.ObjectId,
            ref: "Playlist",
        },
    ],
    followers: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
            username: String,
        },
    ],
});

userSchema.index({ username: 1 });
userSchema.index({ displayName: 1 });

userSchema.pre("save", async function (next) {
    if (this.isModified("displayName")) {
        // Update songs
        await mongoose
            .model("Song")
            .updateMany({ artist: this._id }, { artistName: this.displayName });

        // Update playlists
        await mongoose
            .model("Playlist")
            .updateMany(
                { creator: this._id },
                { creatorName: this.displayName }
            );

        // Update playlist songs
        const playlists = await mongoose.model("Playlist").find({
            "songs.artistName": this.displayName,
        });

        for (const playlist of playlists) {
            playlist.songs.forEach((song) => {
                if (song.artistName === this.displayName) {
                    song.artistName = this.displayName;
                }
            });
            await playlist.save();
        }
    }
    next();
});

module.exports = mongoose.model("User", userSchema);
