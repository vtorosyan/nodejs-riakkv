var RecommenderService = require('../../reengine-service/web-recommender.js').RecommenderService;
var recommender = new RecommenderService();
var request = require("request");

exports.index = function (req, res) {
    res.render('index', {title: 'Rec Slider'})
};

exports.slider = function (req, res) {

    var _recs = [];
    recommender.processRecommend(req, function (err, recommendations) {
        if (err)  return;
        console.log(_recs);

        recommendations.forEach(function (item) {
            item.values.forEach(function (v) {
                var data = eval("(function(){return " + v.data + ";})()");
                _recs.push(data);
            });
        });

        //res.send(recs);
        res.render('slider', {title: 'Rec Slider', recs: _recs});
    });
};