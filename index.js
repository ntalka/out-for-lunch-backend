const database = require('./config/config');
const { Office } = require('./models');
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
      '1-59 * * * *',
      async () => {
        await Office.create({
          name: 'xyz',
          location: 'abc',
        });
        // console.log('job is running');
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
