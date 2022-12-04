const Models = require('../../../models');
const sequelize = require('sequelize');
const Sequelize = require('../../../config/config');
const { QueryTypes } = sequelize;
const { User } = Models;
const RestaurantService = require('./restaurant.service');

class RestaurantController {
  /**
   * getting all restaurants list from API
   *
   *
   * @param {Object} response 200 for success. 400 for failing
   * @returns {Object}
   */

  async getRestaurantListFromAPI(req, res, next) {
    try {
      const restaurants = await RestaurantService.getRestaurantListFromAPI();
      if (restaurants) {
        res.status(200).send({
          message: 'Success',
        });
      } else {
        res.status(400).send({
          message: 'Could not retrieve restaurants',
        });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * get Restaurants list from Office
   *
   * @param {Object} request {
   *
   * headers: {
   *  authorization: authToken
   * }
   * }
   * @param {Object} response 200 for success. 400 for failing
   * @returns {Object}
   */

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
          `SELECT id,name FROM restaurants WHERE JSON_CONTAINS(nearby_office, \'[${user.officeId}]\')`,
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
