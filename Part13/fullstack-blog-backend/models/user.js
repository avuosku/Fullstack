const { Model, DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

class User extends Model {}

User.init(
  {
    name: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    passwordHash: { type: DataTypes.STRING, allowNull: false } // lisätty
  },
  {
    sequelize,
    modelName: 'user',
    underscored: true,
    timestamps: true
  }
);

module.exports = User;
