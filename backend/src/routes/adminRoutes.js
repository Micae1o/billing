const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateAdmin = require('../middleware/authenticateAdmin');

router.get('/users', async (req, res) => {
    try {
        const users = await adminController.getAllUsers();
        res.json({ users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/user-details', async (req, res) => {
    const { user_id } = req.query;
    if (!user_id) {
        return res.status(400).json({ message: 'user_id is required' });
    }

    try {
        const userDetails = await adminController.getUserDetails(user_id);
        res.json(userDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/cancel-subscription', async (req, res) => {
    const { user_id } = req.body;
    if (!user_id) {
        return res.status(400).json({ message: 'user_id is required' });
    }

    try {
        await adminController.cancelSubscription(user_id);
        res.json({ message: 'Subscription canceled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/update-points', async (req, res) => {
    const { user_id, points } = req.body;
    if (!user_id || points === undefined) {
        return res.status(400).json({ message: 'user_id and points are required' });
    }

    try {
        await adminController.updateUserPoints(user_id, points);
        res.json({ message: 'User points updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
