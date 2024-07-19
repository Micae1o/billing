const User = require('../models/user');
const Subscription = require('../models/subscription');
const PaymentHistory = require('../models/paymentHistory');
const PointsHistory = require('../models/pointsHistory');
const SubscriptionType = require('../models/subscriptionType');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const adminService = {
    getAllUsers: async () => {
        try {
            const users = await User.findAll();
            return users;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    getUserDetails: async (user_id) => {
        try {
            const user = await User.findByPk(user_id);
            if (!user) {
                throw new Error('User not found');
            }

            const subscription = await Subscription.findOne({ where: { userId: user_id }, include: SubscriptionType });
            const paymentHistory = await PaymentHistory.findAll({ where: { userId: user_id }, order: [['debitingDate', 'DESC']] });
            const pointsHistory = await PointsHistory.findAll({ where: { userId: user_id }, order: [['date', 'DESC']] });

            return { user, subscription, paymentHistory, pointsHistory };
        } catch (error) {
            throw new Error(error.message);
        }
    },

    cancelSubscription: async (user_id) => {
        try {
            const subscription = await Subscription.findOne({ where: { userId: user_id } });
            if (!subscription) {
                throw new Error('Subscription not found');
            }

            await stripe.subscriptions.del(subscription.stripeSubscriptionId);

            await subscription.destroy();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    updateUserPoints: async (user_id, points) => {
        try {
            const user = await User.findByPk(user_id);
            if (!user) {
                throw new Error('User not found');
            }

            user.balance += points;
            await user.save();

            await PointsHistory.create({
                userId: user_id,
                change: points,
                type: 'admin_update',
                date: new Date()
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }
};

module.exports = adminService;
