const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/user');
const Subscription = require('../models/subscription');
const SubscriptionType = require('../models/subscriptionType');
const PaymentHistory = require('../models/paymentHistory');
const PointsHistory = require('../models/pointsHistory');
const { Op } = require('sequelize');

exports.createCheckoutSession = async (req, res) => {
    const { user_id, subscription_type } = req.body;

    // Проверка наличия необходимых полей
    if (!user_id || !subscription_type) {
        return res.status(400).json({ status: 'error', message: 'user_id and subscription_type are required' });
    }

    try {
        const subscriptionType = await SubscriptionType.findByPk(subscription_type);
        if (!subscriptionType) {
            return res.status(404).json({ status: 'error', message: 'Subscription type not found' });
        }

        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        // Создание сессии подписки
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: subscriptionType.name,
                    },
                    recurring: {
                        interval: 'month',
                    },
                    unit_amount: subscriptionType.price * 100, // Amount in cents
                },
                quantity: 1,
            }],
            success_url: `${process.env.BACKEND_URL}/api/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.BACKEND_URL}/api/payment/cancel`,
            metadata: {
                user_id,
                subscription_type
            }
        });

        res.status(200).json({ status: 'success', url: session.url });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'invoice.payment_succeeded':
            const invoice = event.data.object;
            const subscriptionId = invoice.subscription;
            const subscription = await Subscription.findOne({ where: { stripeSubscriptionId: subscriptionId } });

            if (subscription) {
                const points = (await subscription.getSubscriptionType()).points;
                const user = await User.findByPk(subscription.userId);

                const lastWriteDown = await PaymentHistory.findOne({
                    where: { userId: subscription.userId },
                    order: [['debitingDate', 'DESC']]
                });

                const twoMonthsAgo = new Date();
                twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

                if (!lastWriteDown || lastWriteDown.debitingDate > twoMonthsAgo) {
                    user.balance += points;
                    await user.save();

                    await PointsHistory.create({
                        userId: subscription.userId,
                        change: points,
                        type: 'subscription_payment',
                        date: new Date()
                    });
                }

                await PaymentHistory.create({
                    userId: subscription.userId,
                    debitingDate: new Date(),
                    subscriptionType: subscription.subscriptionTypeId
                });
            }
            break;

        case 'customer.subscription.deleted':
            const deletedSubscription = event.data.object;
            await Subscription.destroy({ where: { stripeSubscriptionId: deletedSubscription.id } });
            break;
    }

    res.status(200).json({ received: true });
};

const clearOldPaymentHistory = async () => {
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    await PaymentHistory.destroy({
        where: {
            debitingDate: {
                [Op.lt]: twoMonthsAgo
            }
        }
    });
};

setInterval(clearOldPaymentHistory, 24 * 60 * 60 * 1000);

module.exports = { clearOldPaymentHistory };
