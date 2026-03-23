const sequelize = require('../utils/db');
const User = require('./user');
const Blog = require('./blog');
const ReadingList = require('./readinglist');

// Assosiaatiot
User.hasMany(Blog);
Blog.belongsTo(User);

// ReadingList-assosiaatiot
User.belongsToMany(Blog, { through: ReadingList, as: 'readings' });
Blog.belongsToMany(User, { through: ReadingList, as: 'usersReading' });

module.exports = {
  User,
  Blog,
  ReadingList,
  sequelize
};
