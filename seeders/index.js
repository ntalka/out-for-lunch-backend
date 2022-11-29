const database = require('../config/config');
require('dotenv').config();
const app = require('../app');

const OfficeSeeder = require('./default-offices.seeder');
const initApp = () => {
  let code = 0;
  new Promise((resolve) => {
    database.authenticate();
    resolve('success');
  }).then(() => {
    const PORT = 3001;
    const server = app.listen(PORT, async () => {
      try {
        await OfficeSeeder();
      } catch (error) {
        console.log('db connection', error);
        code = 1;
      } finally {
        if (server) {
          server.close(() => {
            process.exit(code);
          });
        } else if (code === 1) {
          process.exit(code);
        }
      }
    });
  });
};

initApp();
