const User = require('../models/user');

exports.createUser = async (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ status: 'error', message: 'user_id is required' });
    }

    try {
        const existingUser = await User.findOne({ where: { id: user_id } });
        if (existingUser) {
            return res.status(400).json({ status: 'error', message: 'User already exists' });
        }

        await User.create({ id: user_id, balance: 100 });

        res.status(200).json({ status: 'success', message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
