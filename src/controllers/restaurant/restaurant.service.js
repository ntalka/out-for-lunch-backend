let Axios = require('axios');
const Models = require('../../../models');
const { Restaurant, Office } = Models;

class RestaurantService {
  async getRestaurantListFromAPI() {
    const restaurantIds = await Restaurant.findAll({
      attributes: ['id'],
      raw: true,
    }).then((resp) => {
      return resp.map((res) => res.id);
    });
    const offices = await Office.findAll({
      attributes: ['id', 'location'],
      raw: true,
    });
    if (offices.length < 1) {
      return null;
    }
    let restaurants = [];
    const places = [];
    for (let i = 0; i < offices.length; i++) {
      const office = offices[i];
      let officeLoc = office.location;
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
              data.data.results.forEach((rest) => {
                const location =
                  rest.geometry.location.lat + ',' + rest.geometry.location.lng;

                if (!restaurantIds.includes(rest.place_id)) {
                  const placeIndex = places.indexOf(rest.place_id);
                  if (placeIndex >= 0) {
                    const restaurant = restaurants[placeIndex];
                    const restaurantOffice = restaurant.nearByOffice;
                    restaurantOffice.push(office.id);
                    restaurant.nearByOffice = restaurantOffice;
                    restaurants[placeIndex] = restaurant;
                  } else {
                    restaurants.push({
                      id: rest.place_id,
                      name: rest.name,
                      nearByOffice: [office.id],
                      location,
                    });
                    places.push(rest.place_id);
                  }
                }
              });
            }
          })
          .catch((error) => {
            console.log(error);
            return null;
          });
      }
    }
    await Restaurant.bulkCreate(restaurants);
    return true;
  }
}

module.exports = new RestaurantService();
