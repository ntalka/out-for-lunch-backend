const database = require('../config/config');
require('dotenv').config();
const app = require('../app');
const initApp = () => {
  new Promise((resolve) => {
    database.authenticate();
    resolve('success');
  }).then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
  });
};

initApp();
