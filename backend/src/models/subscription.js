const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const SubscriptionType = require('./subscriptionType');

const Subscription = sequelize.define('Subscription', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    subscriptionType: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: SubscriptionType,
            key: 'id'
        }
    },
    writeOffDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    stripeSubscriptionId: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

Subscription.belongsTo(User, { foreignKey: 'userId' });
Subscription.belongsTo(SubscriptionType, { foreignKey: 'subscriptionType' });

module.exports = Subscription;
