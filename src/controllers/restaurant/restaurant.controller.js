var Axios = require('axios');
const Models = require('../../../models');
const {
    Restaurant
} = Models;


class RestaurantController {

    async getRestaurantList(req, res, next) {

        var officeId = req.body.officeId;
        var officeLoc = '61.449801,23.856506';
        console.log(officeId);
        const URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${process.env.google_maps_api_key}&location=${officeLoc}&radius=${process.env.radius}&type=restaurant`;
        await Axios.get(URL).then(data => {
            if (data && data.data) {

                // console.log(data.data);
                //////////////////////////////////////
                let restaurants = data.data.results.map(async result => {

                    await Restaurant.findOne({
                        // attributes: ['email'],
                        where: {
                            id: result.place_id,
                        },
                    }).then(async (restaurant) => {
                        if (!restaurant) {

                            Restaurant.create({
                                name: result.name,
                                id: result.place_id,
                                nearbyOffice: [1]
                            });
                            res.send({
                                status: 200,
                                message: "Success",
                                data: data.data
                            })
                        }
                        res.send({
                            status: 400,
                            message: "Res already there",
                            data: data.data
                        })
                    })
                    ///////////////////////////////
                    // name: result.name,
                    // place_id: result.place_id
                })

            } else {
                res.send({
                    status: 400,
                    message: "No data",
                    data: []
                })
            }
        }).catch(error => {
            console.log(error);
        })
    }
}

module.exports = new RestaurantController();