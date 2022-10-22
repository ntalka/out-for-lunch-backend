var Axios = require('axios');
const Models = require('../../../models');
const { Restaurant } = Models;

class RestaurantController {
  async getRestaurantList(req, res, next) {
    var officeId = req.body.officeId || 1;
    var officeLoc = '61.449801,23.856506';
    let restaurants = [];
    let nextPageToken = 1;
    let URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${process.env.google_maps_api_key}&location=${officeLoc}&radius=${process.env.radius}`;
    while (!!nextPageToken) {
      if (nextPageToken && nextPageToken !== 1) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${process.env.google_maps_api_key}&pagetoken=${nextPageToken}`;
      }
      await Axios.get(URL)
        .then((data) => {
          if (data && data.data) {
            nextPageToken = data.data.next_page_token;
            const restaurantIds = restaurants.map(
              (restaurant) => restaurant.id
            );
            data.data.results.forEach((rest) => {
              if (!restaurantIds.includes(rest.place_id)) {
                restaurants.push({
                  id: rest.place_id,
                  name: rest.name,
                  nearbyOffice: [officeId],
                });
              }
            });
          }
        })
        .catch((error) => {
          console.log(error);
          res.status(400).send({
            message: 'Could not retrieve restaurants',
          });
        });
    }
    await Restaurant.bulkCreate(restaurants);
    res.status(200).send({
      message: 'Success',
      data: restaurants,
      data2: restaurants.length,
    });
  }
}

module.exports = new RestaurantController();
