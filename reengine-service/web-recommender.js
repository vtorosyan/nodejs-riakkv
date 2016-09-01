//https://github.com/mikeal/request
var request = require("request");

RecommenderService = function () {
};
"use strict";
///Call java serivce for track an item
var serviceAddress = "http://www.google.com";

RecommenderService.prototype.trackItem = function (querystring, callback) {
    var serviceUrl = serviceAddress + querystring

    request(serviceUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback();
        } else {
            callback(error);
        }
    })
};

///Call java service to get recommendations
RecommenderService.prototype.getRecommendation = function (params, callback) {
    callback(null, JSON.parse('{"recommendedItems":[{"value":"3.8", "iid":"18273"},{"value":"4.5", "iid":"58374"},{"value":"4.5", "iid":"58375"},{"value":"4.5", "iid":"58376"},{"value":"4.5", "iid":"58377"},{"value":"4.5", "iid":"58378"} ]}'));
}

//Get recommendations from java service than query needed metada from RIAK with given ids. 
RecommenderService.prototype.processRecommend = function (params, callback) {
    RecommenderService.prototype.getRecommendation(params, function (err, recs) {

        var response = {};

        var mapredInp = [];
        recs.recommendedItems.forEach(function (item) {
            console.log(item);
            mapredInp.push(["items", item.iid])
        });

        var mapred = {
            "inputs": mapredInp,
            "query": [{"map": {"language": "javascript", "source": "function(v) { return [v]; }", "keep": true}}]
        };

        var opts = {
            method: "POST",
            url: "http://localhost:8098/mapred",
            "json": mapred
        };

        request(opts, function (err, response, body) {
            if (err || response.statusCode != 200) {
                console.log(err);
                return callback(err || "Riak returned " + response.statusCode);
            }

            callback(null, body);
        });
    });
}

exports.RecommenderService = RecommenderService;
