const { Model, DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

class Session extends Model {}

Session.init(
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    }
  },
  {
    sequelize,
    modelName: 'session',
    underscored: true,
    timestamps: true
  }
);

module.exports = Session;
