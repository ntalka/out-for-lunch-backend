const express = require('express');
const router = express.Router();
const AuthController = require('../src/controllers/auth/auth.controller');
const GroupController = require('../src/controllers/group/group.controller');
const RestaurantController = require('../src/controllers/restaurant/restaurant.controller');
const OfficeController = require('../src/controllers/office/office.controller');
const UserController = require('../src/controllers/user/user.controller');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express',
  });
});

router.post('/signup', AuthController.auth);
router.post('/login', AuthController.login);
router.post(`/verify/:token`, AuthController.verify);
router.post(`/resend-link`, AuthController.resendAuthToken);

router.put(`/update-user`, UserController.updateUser);

router.post(
  `/get-restaurant-list-api`,
  RestaurantController.getRestaurantListFromAPI
);
router.get(
  `/get-restaurant-list-office`,
  RestaurantController.getRestaurantListFromOffice
);

router.put('/update-group/:id', GroupController.updateGroup);
router.post('/create-custom-group', GroupController.createCustomGroup); //custom group
router.post('/join-group/:groupId', GroupController.joinGroup);
router.post('/join-random-group', GroupController.joinRandomGroup);
router.get('/get-groups-list', GroupController.getGroupsList);
router.delete(`/delete-group/:groupId`, GroupController.deleteGroup);
router.post(`/leave-group/:groupId`, GroupController.leaveGroup);

router.post(`/add-office`, OfficeController.addOffice);
router.get(`/get-offices-list`, OfficeController.getOfficesList);
router.post(`/eat-at-office`, OfficeController.eatAtOffice);

module.exports = router;