const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SubscriptionType = sequelize.define('SubscriptionType', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = SubscriptionType;
