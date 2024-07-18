const User = require('../models/user');
const Subscription = require('../models/subscription');
const PaymentHistory = require('../models/paymentHistory');

exports.getUserBalance = async (req, res) => {
    const { user_id } = req.query;

    try {
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        res.status(200).json({ status: 'success', balance: user.balance });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.getUserSubscription = async (req, res) => {
    const { user_id } = req.query;

    try {
        const subscription = await Subscription.findOne({ where: { userId: user_id } });
        if (!subscription) {
            return res.status(404).json({ status: 'error', message: 'Subscription not found' });
        }
        res.status(200).json({
            status: 'success',
            subscription_type: subscription.subscriptionType,
            write_off: subscription.writeOffDate
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.cancelSubscription = async (req, res) => {
    const { user_id } = req.body;

    try {
        const subscription = await Subscription.findOne({ where: { userId: user_id } });
        if (!subscription) {
            return res.status(404).json({ status: 'error', message: 'Subscription not found' });
        }
        await subscription.destroy();
        res.status(200).json({ status: 'success', message: 'Subscription canceled successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.getPaymentHistory = async (req, res) => {
    const { user_id } = req.query;

    try {
        const history = await PaymentHistory.findAll({
            where: { userId: user_id },
            attributes: ['debitingDate', 'subscriptionType'],
            order: [['debitingDate', 'DESC']]
        });

        if (!history.length) {
            return res.status(404).json({ status: 'error', message: 'No payment history found' });
        }

        res.status(200).json({ status: 'success', history });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.writeDownPoints = async (req, res) => {
    const { user_id, points } = req.body;

    try {
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        if (user.balance < points) {
            return res.status(400).json({ status: 'error', message: 'Insufficient balance' });
        }
        user.balance -= points;
        await user.save();
        res.status(200).json({ status: 'success', message: 'Points written down successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
