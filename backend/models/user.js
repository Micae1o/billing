const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    balance: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
});

module.exports = User;
