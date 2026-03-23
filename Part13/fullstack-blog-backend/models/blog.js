const { Model, DataTypes } = require('sequelize')
const sequelize = require('../utils/db')

class Blog extends Model {}

Blog.init(
  {
    title: { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    likes: { type: DataTypes.INTEGER, defaultValue: 0 },
    year: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      validate: {
        min: 1991,
        max: new Date().getFullYear()
      }
    }
  },
  {
    sequelize,
    modelName: 'Blog',
    underscored: true,
    timestamps: true
  }
)

module.exports = Blog
