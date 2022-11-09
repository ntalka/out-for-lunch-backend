var Axios = require('axios');
const Models = require('../../../models');
const sequelize = require('sequelize');
const Sequelize = require('../../../config/config');
const {
    Op,
    QueryTypes
} = sequelize;
const {
    Restaurant,
    User
} = Models;

class RestaurantController {
    async getRestaurantListFromAPI(req, res, next) {
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
                                    nearByOffice: [officeId],
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
    async getRestaurantListFromOffice(req, res, next) {

        const authToken = req.headers.authorization;;

        try {
            let {
                officeId
            } = await User.findOne({
                attributes: ['id', 'officeId'],
                where: {
                    authToken,
                },
            }).then(async (userResult) => {
                console.log(userResult);
                if (userResult) {
                    const nearByRestaurants = await Sequelize.query(
                        `SELECT id,name FROM restaurants WHERE JSON_CONTAINS(nearby_office, \'[${userResult.officeId}]\')`, {
                            type: QueryTypes.SELECT,
                        }
                    ).then((resp) => {
                        if (resp) {

                            resp.sort(function (a, b) {
                                return a.name === b.name ? 0 : a.name < b.name ? -1 : 1;
                            });
                            return res.send({
                                status: 200,
                                message: 'Restaurant Fetched Successfully',
                                data: resp,

                            });
                        } else {
                            return res.send({
                                status: 400,
                                message: 'Failed to fetch restaurant',

                            });
                        }
                    });
                } else {
                    return res.send({
                        status: 400,
                        message: 'Failed to fetch user',

                    });
                }

            })
        } catch (error) {
            next(error)
        }

    }
}

module.exports = new RestaurantController();