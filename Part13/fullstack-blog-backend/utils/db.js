// utils/db.js
const { Sequelize } = require('sequelize'); // <<< tämä on tärkeää

const sequelize = new Sequelize('blogdb', 'user', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

module.exports = sequelize;
