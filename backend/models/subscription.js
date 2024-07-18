const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

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
        type: DataTypes.STRING,
        allowNull: false
    },
    writeOffDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

Subscription.belongsTo(User, { foreignKey: 'userId' });

module.exports = Subscription;
