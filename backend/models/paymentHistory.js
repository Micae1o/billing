const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const PaymentHistory = sequelize.define('PaymentHistory', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    debitingDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    subscriptionType: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

PaymentHistory.belongsTo(User, { foreignKey: 'userId' });

module.exports = PaymentHistory;
