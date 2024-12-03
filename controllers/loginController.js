const User = require("../models/User");
const bcrypt = require("bcrypt");

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd)
        return res
            .status(400)
            .json({ message: "Username and password are required." });
    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) return res.sendStatus(401);
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        res.json({ match, foundUser });
    } else {
        res.sendStatus(401);
    }
};

module.exports = { handleLogin };
