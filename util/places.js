// const request = {
//     location: new google.maps.LatLng(61.449801, 23.856506),
//     radius: 5000,
//     type: ['restaurant']
// };

// const results = [];


// const service = new google.maps.places.PlacesService(places);

// const callback = (response, status, pagination) => {
//     if (status == google.maps.places.PlacesServiceStatus.OK) {
//         results.push(...response);
//     }

//     if (pagination.hasNextPage) {
//         setTimeout(() => pagination.nextPage(), 2000);
//     } else {
//         displayResults();
//     }
// }

// var restaurantResult = [];
// const map1 = new Map();

// const displayResults = () => {
//     let sorted = results
//         .filter(result => result.rating)
//         .sort((a, b) => a.rating > b.rating ? -1 : 1)
//         .map(result => ({
//             place_id: result.place_id,
//             name: result.name,
//         }));

//     // console.log(map1.size);

//     console.log(sorted);

// }

// service.nearbySearch(request, callback);