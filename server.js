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
app.use("/users", require("./routes/api/users"));

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
