const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/user');
const Subscription = require('../models/subscription');

exports.createCheckoutSession = async (req, res) => {
    const { user_id, amount, subscription_type } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Payment for subscription',
                    },
                    unit_amount: amount * 100, // Amount in cents
                },
                quantity: 1,
            }],
            mode: 'payment',
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

exports.verifyPayment = async (req, res) => {
    const { session_id } = req.query;

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === 'paid') {
            const { user_id, subscription_type } = session.metadata;
            const user = await User.findByPk(user_id);
            if (user) {
                const writeOffDate = new Date();
                writeOffDate.setMonth(writeOffDate.getMonth() + 1);

                await Subscription.upsert({
                    userId: user_id,
                    subscriptionType: subscription_type,
                    writeOffDate
                });
                res.status(200).json({ status: 'success', message: 'Payment verified and subscription updated successfully' });
            } else {
                res.status(404).json({ status: 'error', message: 'User not found' });
            }
        } else {
            res.status(400).json({ status: 'error', message: 'Payment not completed' });
        }
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

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { user_id, subscription_type } = session.metadata;

        const user = await User.findByPk(user_id);
        if (user) {
            const writeOffDate = new Date();
            writeOffDate.setMonth(writeOffDate.getMonth() + 1);

            await Subscription.upsert({
                userId: user_id,
                subscriptionType: subscription_type,
                writeOffDate
            });
        }
    }

    res.status(200).json({ received: true });
};
