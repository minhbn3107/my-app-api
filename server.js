require("dotenv").config();

const express = require("express");
const connectDB = require("./config/dbConn");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3500;
const app = express();

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

//routing path
connectDB();
app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/songs", require("./routes/api/songs"));
app.use("/api/playlists", require("./routes/api/playlists"));
app.use("/api/artists", require("./routes/api/artists"));
app.use("/api/search", require("./routes/api/search"));

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
