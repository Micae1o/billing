const User = require('../models/user');

exports.register = async (req, res) => {
    const { id } = req.body;

    try {
        const existingUser = await User.findOne({ where: { id } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = await User.create({
            id,
            balance: 100
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
