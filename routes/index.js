var express = require('express');
var router = express.Router();
var AuthController = require('../src/controllers/auth/auth.controller')

var RestaurantController = require('../src/controllers/restaurant/restaurant.controller')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.post('/signup', AuthController.auth);
router.post('/login', AuthController.login);
router.post(`/verify/:token`, AuthController.verify);
router.post(`/getRestaurantList`, RestaurantController.getRestaurantList);



module.exports = router;