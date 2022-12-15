/** Express router providing user related routes
 * @module routers/users
 * @requires express
 */

/**
 * express module
 * @const
 */

const express = require('express');
/**
 * Express router to mount user related functions on.
 * @type {object}
 * @const
 * @namespace usersRouter
 */
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
/**
 * Route serving signup functionality.
 * @name post/login
 */
router.post('/signup', AuthController.auth);
/**
 * Route serving login functionality.
 * @name post/login
 */

router.post('/login', AuthController.login);
/**
 * Route serving email verification functionality. token is the auth token.
 * @name post/verify/:token
 */
router.post(`/verify/:token`, AuthController.verify);

/**
 * Route serving resend email functionality.
 * @name post/resend-link
 */

router.post(`/resend-link`, AuthController.resendAuthToken);

/**
 * Route serving updating user functionality.
 * @name put/update-user
 */
router.put(`/update-user`, UserController.updateUser);

/**
 * Route for getting restaurants from google api functionality.
 * @name post/get-restaurant-list-api
 */
router.post(
  `/get-restaurant-list-api`,
  RestaurantController.getRestaurantListFromAPI
);
/**
 * Route for getting restaurants list nearby users office.
 * @name get/get-restaurant-list-office
 */
router.get(
  `/get-restaurant-list-office`,
  RestaurantController.getRestaurantListFromOffice
);
/**
 * Route for updating group taking groupId as id in params
 * @name put/update-group/:id
 */
router.put('/update-group/:id', GroupController.updateGroup);

/**
 * Route for creating custom group
 * @name post/create-custom-group
 */

router.post('/create-custom-group', GroupController.createCustomGroup); //custom group

/**
 * Route for joining custom group taking groupId in params
 * @name post/join-group/:groupId
 */
router.post('/join-group/:groupId', GroupController.joinGroup);

/**
 * Route for joining random group
 * @name post/join-random-group/
 */
router.post('/join-random-group', GroupController.joinRandomGroup);

/**
 * Route for geting all groups
 * @name get/get-groups-list
 */
router.get('/get-groups-list', GroupController.getGroupsList);
/**
 * Route for deleting groups taking groupId in params
 * @name delete/delete-group/:groupId
 */
router.delete(`/delete-group/:groupId`, GroupController.deleteGroup);

/**
 * Route for leaving groups taking groupId in params
 * @name post/leave-group/:groupId
 */
router.post(`/leave-group/:groupId`, GroupController.leaveGroup);

/**
 * Route for adding office
 * @name post/add-office
 */
router.post(`/add-office`, OfficeController.addOffice);

/**
 * Route for getting all office
 * @name get/get-offices-list
 */
router.get(`/get-offices-list`, OfficeController.getOfficesList);

/**
 * Route for eating in office
 * @name post/eat-at-office
 */
router.post(`/eat-at-office`, OfficeController.eatAtOffice);

module.exports = router;
