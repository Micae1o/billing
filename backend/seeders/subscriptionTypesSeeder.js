const SubscriptionType = require('../models/subscriptionType');

const seedSubscriptionTypes = async () => {
    const subscriptionTypes = [
        { id: 1, name: 'Начальный', price: 1000 },
        { id: 2, name: 'PRO', price: 3000 },
        { id: 3, name: 'PRO+', price: 5000 }
    ];

    for (const type of subscriptionTypes) {
        const [subscriptionType, created] = await SubscriptionType.findOrCreate({
            where: { id: type.id },
            defaults: type
        });
    }
};

module.exports = seedSubscriptionTypes;
