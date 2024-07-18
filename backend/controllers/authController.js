const User = require('../models/user');

exports.createUser = async (req, res) => {
    const { user_id } = req.body;

    try {
        const user = await User.create({ id: user_id, balance: 0 });
        res.status(200).json({ status: 'success', message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
