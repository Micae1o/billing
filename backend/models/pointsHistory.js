const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const PointsHistory = sequelize.define('PointsHistory', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    change: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
});

PointsHistory.belongsTo(User, { foreignKey: 'userId' });

module.exports = PointsHistory;
