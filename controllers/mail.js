
var config = require('../config/config');
var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: config.EMAIL_SERVICE,
    auth: {
        user: config.EMAIL_ADDRESS,
        pass: config.EMAIL_PWD
    }
});


exports.send=function(to, subject, html, callback){
    // NB! No need to recreate the transporter object. You can use
    // the same transporter object for all e-mails

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: config.EMAIL_ACCOUNT+'<'+config.EMAIL_ADDRESS+'>', // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        html: html // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log('Error: ' + error);
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
        callback(error);
    });
}