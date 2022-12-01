const database = require('./config/config');
const RestaurantService = require('./src/controllers/restaurant/restaurant.service');
require('dotenv').config();
const { CronJob } = require('cron');
const app = require('./app');
const initApp = () => {
  new Promise((resolve) => {
    database.authenticate();
    resolve('success');
  }).then(() => {
    const PORT = process.env.PORT || 3000;
    const restaurantJob = new CronJob(
      '59 23 * * 0',
      async () => {
        await RestaurantService.getRestaurantListFromAPI();
      },
      null,
      true,
      'Etc/GMT'
    );

    restaurantJob.start();
    app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
  });
};

initApp();
