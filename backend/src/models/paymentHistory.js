const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PaymentHistory = sequelize.define('PaymentHistory', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    debitingDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    subscriptionType: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
});

module.exports = PaymentHistory;
