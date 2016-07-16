var express = require('express');
var url  = require('url');
var request = require("request");
var cheerio = require("cheerio");
var q = require("q");

var promises = [];
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

function getTitle(url){
	var deferred = q.defer();
	url = addProtocol(url);
	if (validate(url)){
	request({
		  uri: URLs[i],
		}, function(error, response, body) {
			var $ = cheerio.load(body);
			deferred.resolve(url + ": " + $("title").text());
		});
	}else {
			deferred.resolve(url + ": No Response");
	}
	return deferred.promise;
}
  
app.get('/i/want/title/', function(req, res) {
	var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
	URLs = query.address;
	
	for (i in URLs){
		promises.push(getTitle(URLs[i]));
	}
	q.all(promises).then(function(result) {
		res.render('index.ejs', { titles: result });
    }).catch(function(err) {
		console.log(err);
	});
	
});

app.listen(3000, function () {
  console.log('listening on port 3000...');
});