HelpService = function () {
};

HelpService.prototype.getRandomKey = function () {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 8;
    var randomPass = '';
    for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomPass += chars.substring(rnum, rnum + 1);
    }
    return randomPass;
};

HelpService.prototype.createMessage = function (name) {
    var message = {
        from: 'rec@rec.com',
        to: 'rec-test@rec.com',
        subject: 'Hello,' + name,
        text: 'Hello,' + name,
        html: '<h3>You are requesting new password for your recommendation engine.</h3><p>Please change your password after first login.</p><p>Password:' + HelpService.prototype.getRandomKey() + '</p>'
    }
    console.log(message);
    return message;
};

HelpService.prototype.sendMail = function (transport, name) {
    transport.sendMail(HelpService.prototype.createMessage(name), function (error) {
        if (error) {
            console.log('Error occured');
            console.log(error.message);
        } else {
            console.log('Message sent successfully!');
        }
        // if you don't want to use this transport object anymore, uncomment following line
        //transport.close(); // close the connection pool
    });
}


HelpService.prototype.isEmpty = function (val) {
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}

HelpService.prototype.getUserByEmail = function (email, db) {
    db.get('users', email, function (err, data) {
        if (err) {
            return null;
        } else {
            return data;
        }
    })
}

exports.HelpService = HelpService;

