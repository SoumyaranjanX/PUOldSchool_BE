const UserModel = require('../models/userModel')


const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.create({ username, email, password });
        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Other controller methods like getUser, updateUser, deleteUser, etc. can be added here

module.exports = { createUser }