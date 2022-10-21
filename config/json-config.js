require('dotenv').config();
const { db_host, db_user, db_database, db_password, db_port } = process.env;
const config = {
  development: {
    username: db_user,
    password: db_password,
    database: db_database,
    host: db_host,
    port: db_port,
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};
module.exports = config;
