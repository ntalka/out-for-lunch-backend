const Sequelize = require('sequelize');

require('dotenv').config();

const { db_host, db_user, db_database, db_password, db_port, timezone } =
  process.env;

const database = new Sequelize(db_database, db_user, db_password, {
  host: db_host,
  port: db_port,
  dialect: 'mysql',
  dialectOptions: { connectTimeout: 60000 },
  logging: console.log,
  timezone,
});

module.exports = database;
