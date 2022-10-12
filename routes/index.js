var express = require('express');
var router = express.Router();
var AuthController = require('../src/controllers/auth/auth.controller')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.post('/signup', AuthController.auth);

router.post(`/verify/:token`, AuthController.verify);



module.exports = router;