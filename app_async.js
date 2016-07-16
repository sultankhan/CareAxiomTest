var express = require('express');
var url  = require('url');
var request = require("request");
var cheerio = require("cheerio");
var async = require('async');

var app = express();
app.set('view engine', 'ejs');

function addProtocol(url) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = "http://" + url;
    }
    return url;
}

function validate(url) {
        var pattern = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/;
        if (pattern.test(url)) {
            return true;
        } 
            return false;
}

var getTitle = function (cb, url) {
	url = addProtocol(url);
	if (validate(url)){
	request({
		  uri: url,
		}, function(error, response, body) {
			var $ = cheerio.load(body);
			cb(null, url + ": " + $("title").text());
		});
	}else {
		cb(null, url + ": No Response");
	}
};

app.get('/i/want/title/', function(req, res) {
	var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
	
	URLs = query.address;
	async.map(URLs, function(url, callback){
	  getTitle(callback, url);
	}, function(err,result){
		if (err) {
			console.log(err);
			return;
		}
		 res.render('index.ejs', { titles: result });
	});
	
});

app.listen(3000, function () {
  console.log('listening on port 3000...');
});

