var db = require('riak-js').getClient();
var nodemailer = require("nodemailer");
var HelpService = require('../service.js').HelpService;
var helper = new HelpService();

var transport = nodemailer.createTransport("SMTP", {
    service: 'Gmail',
    auth: {
        user: "myaccount@gmail.com",
        pass: "MyPASS"
    }
});

exports.index = function (req, res) {
    if (req.session.email) {
        res.render('index', {title: 'Recommendation engine', page: 'Home', firstname: req.session.email})
    } else {
        res.redirect('/login');
    }
};

exports.register = function (req, res) {
    res.render('register', {title: 'Recommendation engine', page: 'Sign Up'})
};

exports.login = function (req, res) {
    res.render('login', {title: 'Recommendation engine', page: 'Sign In'})
};

exports.forgotPassword = function (req, res) {
    res.render('forgot_password', {title: 'Recommendation engine', page: 'Forgot Password'})
};

exports.logout = function (req, res) {
    delete req.session.email;
    res.redirect('/login');
};

// handler for form submitted from register
exports.register_post_handler = function (req, res) {
    if (!req.body.firstname) {
        res.render('register', {
            title: 'Recommendation engine',
            page: 'Sign Up',
            company: req.body.company,
            error: 'firstname'
        });
        return;
    }
    if (!req.body.lastname) {
        res.render('register', {
            title: 'Recommendation engine', page: 'Sign Up', firstname: req.body.firstname,
            company: req.body.company, error: 'lastname'
        });
        return;
    }

    if (!req.body.email) {
        res.render('register', {
            title: 'Recommendation engine', page: 'Sign Up',
            firstname: req.body.firstname, lastname: req.body.lastname, company: req.body.company, error: 'email'
        });
        return;
    }

    password = req.body.password;
    if (!password) {
        res.render('register', {
            title: 'Recommendation engine', page: 'Sign Up',
            firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email,
            company: req.body.company, error: 'password'
        });
        return;
    }

    cpassword = req.body.cpassword;
    if (!cpassword || (password !== cpassword)) {
        res.render('register', {
            title: 'Recommendation engine', page: 'Sign Up',
            firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email,
            company: req.body.company, error: 'cpassword'
        });
        return;
    }
    var isExists = false;
    db.save("userinfo", req.body.email, req.body, function (err) {
        if (err) {
            res.render('register', {title: 'Recommendation engine', page: 'Sign Up', error: 'riak'});
        } else {
            var apiKey = helper.getRandomKey();
            do {

            } while (!isExists);

            db.save("userapi", req.body.email, {'key': helper.getRandomKey()}, function (err) {
                if (err) {
                    res.render('register', {title: 'Recommendation engine', page: 'Sign Up', error: 'riak'});
                } else {
                    req.session.email = req.body.email;
                    res.redirect('/index');
                }
            });
        }
    });
};

// handler for form submitted from login
exports.login_post_handler = function (req, res) {
    if (helper.isEmpty(req.body.email)) {
        res.render('login', {title: 'Recommendation engine', email: req.body.email, page: 'Sign In', error: 'email'});
        return;
    }

    if (helper.isEmpty(req.body.password)) {
        res.render('login', {
            title: 'Recommendation engine',
            email: req.body.email,
            page: 'Sign In',
            error: 'password'
        });
        return;
    }

    db.get('userinfo', req.body.email, function (err, data) {
        if (err) {
            res.render('login', {title: 'Recommendation engine', page: 'Sign In', error: 'riak'});
            return;
        } else {
            req.session.email = req.body.email;
            res.redirect('/index');
        }
    })
};

// handler for form submitted from login
exports.forgot_post_handler = function (req, res) {
    email = req.body.email;
    if (!email) {
        res.render('forgot_password', {title: 'Recommendation engine', page: 'Forgot Password', error: 'email'});
        return;
    }
    var name;
    db.get('userinfo', email, function (err, data) {
        if (err) {
            res.render('forgot_password', {title: 'Recommendation engine', page: 'Forgot Password', error: 'email'});
            return;
        } else {
            console.log('data ' + data.firstname);
            name = data.firstname;
            console.log('Sending Mail');

            helper.sendMail(transport, name);
            res.redirect('/login');
        }
    })
};
