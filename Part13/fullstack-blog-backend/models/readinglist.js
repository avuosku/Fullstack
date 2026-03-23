const { Model, DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

class ReadingList extends Model {}

ReadingList.init(
  {
    read: { type: DataTypes.BOOLEAN, defaultValue: false }
  },
  {
    sequelize,
    modelName: 'ReadingList',
    tableName: 'reading_lists',
    underscored: true,
    timestamps: false
  }
);

module.exports = ReadingList;
