const SubscriptionType = require('../models/subscriptionType');

const seedSubscriptionTypes = async () => {
    const subscriptionTypes = [
        { id: 1, name: 'Начальный', points: 1000, price: 500, },
        { id: 2, name: 'PRO', points: 3000, price: 1000 },
        { id: 3, name: 'PRO+', points: 5000, price: 2000 }
    ];

    for (const type of subscriptionTypes) {
        const [subscriptionType, created] = await SubscriptionType.findOrCreate({
            where: { id: type.id },
            defaults: type
        });
    }
};

module.exports = seedSubscriptionTypes;
