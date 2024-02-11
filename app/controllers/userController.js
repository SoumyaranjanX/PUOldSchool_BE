import UserModel from '../models/userModel.js';

const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await UserModel.create({ username, email, password });
        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Other controller methods like getUser, updateUser, deleteUser, etc. can be added here

export default createUser;
