const express = require('express');
var router = express.Router();
const AuthController = require('../src/controllers/auth/auth.controller');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express',
  });
});

router.post('/signup', AuthController.auth);
router.post('/login', AuthController.login);
router.post(`/verify/:token`, AuthController.verify);

module.exports = router;
