const express = require('express');
var router = express.Router();
var AuthController = require('../src/controllers/auth/auth.controller');
var GroupController = require('../src/controllers/group/group.controller');
var RestaurantController = require('../src/controllers/restaurant/restaurant.controller');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express',
  });
});

router.post('/signup', AuthController.auth);
router.post('/login', AuthController.login);
router.post(`/verify/:token`, AuthController.verify);

router.post(
  `/get-restaurant-list-api`,
  RestaurantController.getRestaurantListFromAPI
);

router.post('/create-cutom-group', GroupController.createCustomGroup); //custom group
router.post('/create-random-group', GroupController.createRandomGroup);
router.post('/join-group', GroupController.joinGroup);
router.post('/join-random-group', GroupController.joinRandomGroup);
router.get('/get-groups-list', GroupController.getGroupsList);
router.delete(`/delete-group/:groupId`, GroupController.deleteGroup);

module.exports = router;