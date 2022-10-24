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
};
module.exports = config;
