const User = require("../models/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
    const { user, pwd, displayName, email } = req.body;

    if (!user || !pwd || !displayName || !email)
        return res.status(400).json({
            message: "Username, password, displayName, email are required.",
        });
    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate)
        return res.status(409).json({ message: "Username already exists" });
    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        //create and store the new user
        const result = await User.create({
            username: user,
            password: hashedPwd,
            displayName,
            email,
        });

        res.status(201).json({ success: `New user ${user} created!`, result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { handleNewUser };
