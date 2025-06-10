// src/database/sequelize.js
const { Sequelize } = require('sequelize');
const { db } = require('../config/config');

const sequelize = new Sequelize(db.database, db.user, db.password, {
  host: db.host,
  dialect: 'mysql',
  logging: true,
});

module.exports = sequelize;
