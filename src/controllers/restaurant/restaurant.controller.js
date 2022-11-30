let Axios = require('axios');
const Models = require('../../../models');
const sequelize = require('sequelize');
const Sequelize = require('../../../config/config');
const { QueryTypes } = sequelize;
const { Restaurant, User, Office } = Models;

class RestaurantController {
  async getRestaurantListFromAPI(req, res, next) {
    let officeId = req.body.officeId || 1;
    const office = await Office.findOne({
      attributes: ['location'],
      where: {
        id: officeId,
      },
    });
    if (!office) {
      return res.status(400).send({
        message: 'No office found',
      });
    }
    let officeLoc = office.location;
    let restaurants = [];
    let nextPageToken = 1;
    let URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${process.env.google_maps_api_key}&location=${officeLoc}&radius=${process.env.radius}&type=restaurant`;
    while (!!nextPageToken) {
      if (nextPageToken && nextPageToken !== 1) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${process.env.google_maps_api_key}&pagetoken=${nextPageToken}&type=restaurant`;
      }
      await Axios.get(URL)
        .then((data) => {
          if (data && data.data) {
            nextPageToken = data.data.next_page_token;
            const restaurantIds = restaurants.map(
              (restaurant) => restaurant.id
            );
            data.data.results.forEach((rest) => {
              const location =
                rest.geometry.location.lat + ',' + rest.geometry.location.lng;

              if (!restaurantIds.includes(rest.place_id)) {
                restaurants.push({
                  id: rest.place_id,
                  name: rest.name,
                  nearByOffice: [officeId],
                  location,
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
    });
  }
  async getRestaurantListFromOffice(req, res, next) {
    const authToken = req.headers.authorization;

    try {
      let user = await User.findOne({
        attributes: ['id', 'officeId'],
        where: {
          authToken,
        },
      });
      if (user) {
        let nearByRestaurants = await Sequelize.query(
          `SELECT id,name FROM restaurants WHERE JSON_CONTAINS(nearby_office, \'[${userResult.officeId}]\')`,
          {
            type: QueryTypes.SELECT,
          }
        );
        if (nearByRestaurants) {
          nearByRestaurants.sort(function (a, b) {
            return a.name === b.name ? 0 : a.name < b.name ? -1 : 1;
          });
          return res.send({
            status: 200,
            message: 'Restaurant Fetched Successfully',
            data: nearByRestaurants,
          });
        } else {
          return res.send({
            status: 400,
            message: 'Failed to fetch restaurant',
          });
        }
      } else {
        return res.send({
          status: 400,
          message: 'Failed to fetch user',
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RestaurantController();
