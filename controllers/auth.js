var qs = require('querystring');
var async = require('async');
var jwt = require('jwt-simple');
var moment = require('moment');
var request = require('request');
var config = require('../config/config');
var User = require('../models/users');
var randomstring = require("randomstring");
var mail=require('../controllers/mail');
/*
 |--------------------------------------------------------------------------
 | Login Required Middleware
 |--------------------------------------------------------------------------
 */
exports.ensureAuthenticated= function(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
    }
    var token = req.headers.authorization.split(' ')[1];

    var payload = null;
    try {
        payload = jwt.decode(token, config.TOKEN_SECRET);
    }
    catch (err) {
        return res.status(401).send({ message: err.message });
    }

    if (payload.exp <= moment().unix()) {
        return res.status(401).send({ message: 'Token has expired' });
    }
    req.user = payload.sub;
    next();
}

/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createJWT(user) {
    var payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
}


/*
 |--------------------------------------------------------------------------
 | GET /api/me
 |--------------------------------------------------------------------------
 */

exports.get_api_me= function(req, res) {
    User.findById(req.user, function(err, user) {
        res.send(user);
    });
};

/*
 |--------------------------------------------------------------------------
 | PUT /api/me
 |--------------------------------------------------------------------------
 */
exports.put_api_me = function (req, res) {
    User.findById(req.user, function(err, user) {
        if (!user) {
            return res.status(400).send({ message: 'User not found' });
        }
        user.displayName = req.body.displayName || user.displayName;
        user.email = req.body.email || user.email;
        user.save(function(err) {
            res.status(200).end();
        });
    });
};


/*
 |--------------------------------------------------------------------------
 | Log in with Email
 |--------------------------------------------------------------------------
 */
exports.login= function(req, res) {
    User.findOne({ email: req.body.email }, '+password', function(err, user) {
        if (!user) {
            return res.status(401).send({ message: 'Wrong email and/or password' });
        }
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (!isMatch) {
                return res.status(401).send({ message: 'Wrong email and/or password' });
            }
            res.send({ token: createJWT(user) });
        });
    });
};

/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
exports.signup = function (req, res) {
    User.findOne({ email: req.body.email }, function(err, existingUser) {
        if (existingUser) {
            ;//return res.status(409).send({message: 'Email is already taken'});
        }
        console.log(req.body.displayName+","+req.body.email+","+req.body.password);
        var user = new User({
            displayName: req.body.displayName,
            email: req.body.email,
            password: req.body.password,
            activated: false,
            code : randomstring.generate(16)

        });

        user.save(function(data) {
            console.log(data);

            var link = config.EMAIL_CALLBACK_DOMAIN + "?email=" + user.email + "&code=" + user.code;
            var html = "Confirm email: <br>";
            html += "<a href='" + link + "'>" + link + "</a>";
            mail.send(user.email, 'Email confirmation', html, function (error) {
                if (error)
                    res.status(409).send({error: 'Email not send. Retry'});
                else {
                    user.save(function () {
                        res.status(200).send({email: user.email});
                    });
                }
            });
        });

    });
};
/*
 |--------------------------------------------------------------------------
 | Confirm Email Account
 |--------------------------------------------------------------------------
 */
exports.verify = function (req, res) {
    User.findOne({ email: req.query.email}, function(err, user) {
        console.log(user.code+"-"+req.query.code);
        if (user.activated==true) {
            return res.status(409).send({message: 'User just verified'});
        }else if (user.code!=req.query.code) {
            console.log(user.code+"-"+req.query.code);
            return res.status(409).send({ message: 'Invalid code' });
        }else {
            user.code = null;
            user.activated = true;

            user.save(function () {
                res.send(200,{token: createJWT(user)});
            });
        }
    });
};
/*
 |--------------------------------------------------------------------------
 | Unlink Provider
 |--------------------------------------------------------------------------
 */
exports.unlink = function (req, res) {
    var provider = req.body.provider;
    var providers = ['facebook', 'foursquare', 'google', 'github', 'instagram',
        'linkedin', 'live', 'twitter', 'twitch', 'yahoo'];

    if (providers.indexOf(provider) === -1) {
        return res.status(400).send({ message: 'Unknown OAuth Provider' });
    }

    User.findById(req.user, function(err, user) {
        if (!user) {
            return res.status(400).send({ message: 'User Not Found' });
        }
        user[provider] = undefined;
        user.save(function() {
            res.status(200).end();
        });
    });
};