// http://mcavage.github.com/node-restify/
var restify = require('restify');

// http://riakjs.org/
var db = require('riak-js').getClient();
var request = require("request");
var url = require('url');
var util = require('util');
var fs = require('fs');

require('nodetime').profile();

var RecommenderService = require('./web-recommender').RecommenderService;

var recommender = new RecommenderService();

var server = restify.createServer();
server.use(restify.queryParser());

process.on('uncaughtException', function (err) {
    console.error(err, err.stack)
});

server.post('/api', function create(req, res, next) {
    res.send(201, Math.random().toString(36).substr(3, 8));
    return next();
});

// Call to learn given id and name in url.
// It is mandatory to pass iid and name parameters in url.
server.get('/api/learn/', function create(req, res, next) {    
    learn(req, function (err) {
        if (err)  return next(err);
        res.send(201, "success");
    });
});

server.get('/api/recommend', function create(req, res, next) {
    recommender.recommend(req, function (err, recommendations) {
        if (err)  return next(err);
        res.send(201, recommendations);
    });
});

//Track and store metadata.
function learn(req, callback) {
    var cbCount = 2;
    var cbError = false;
    storeMetaData(req, function (err) {

        if (cbError) return;

        if (err) {
            cbError = true;
            return callback(err);
        }
        if (--cbCount == 0) callback();
    });
    var qs = url.parse(req.url, true);
    recommender.trackItem(qs.search, function (err) {
        if (cbError) return;

        if (err) {
            cbError = true;
            return callback(err);
        }
        if (--cbCount == 0) callback(err);
    });
}

//Store needed item metadata to RIAK from request.
function storeMetaData(req, callback) {    
    db.save("items", req.params.iid, paramsToJSON(req), function (err) {
        callback(err);
    });
}

//Create JSON from reqest parameeters.
function paramsToJSON(req) {
    var qs = url.parse(req.url, true);
    var jsonObj = util.inspect(qs.query);
    return jsonObj;
}

//static content.
server.get('/index', function (req, res, next) {
    fs.readFile('./reengine/example.html', 'utf8', function (err, file) {
        if (err) {
            res.send(500);
            return next();
        }
        
        res.write(file);
        res.end();
        return next();
    });
});

//static content.
server.get('/reengine.js', function (req, res, next) {
    fs.readFile('./reengine/reengine.js', 'utf8', function (err, file) {
        if (err) {
            res.send(500);
            return next();
        }
        
        res.write(file);
        res.end();
        return next();
    });
});

// Set server to start at 3000 port.
server.listen(3000, function () {
    console.log('%s listening at %s', server.name, server.url);
});