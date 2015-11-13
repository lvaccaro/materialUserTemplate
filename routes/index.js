
var config = require('../config/config');
var User = require('../models/users');
var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var auth=require('../controllers/auth');


router.get('/api/me', auth.ensureAuthenticated, auth.get_api_me);

router.put('/api/me', auth.ensureAuthenticated, auth.put_api_me);

router.post('/auth/login', auth.login);

router.get ('/auth/verify', auth.verify);

router.post('/auth/signup', auth.signup);

router.post('/auth/unlink', auth.ensureAuthenticated, auth.unlink);

module.exports = router;
