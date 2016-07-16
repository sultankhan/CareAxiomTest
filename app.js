var express = require('express');
var url  = require('url');
var request = require("request");
var cheerio = require("cheerio");

var app = express();
var results = [];
var URLs = [];

app.set('view engine', 'ejs');

app.get('/i/want/title/', function(req, res) {
	var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
	
	// check for multiple addresses.
	if (Array.isArray(query.address)){
		URLs = query.address;
	}else {
		URLs.push(query.address);
	}
	
	// callback 
	function done(data){
		res.render('index.ejs', { titles: data });
	}
	 
	synchAPICalls(URLs,done);
	
});

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

function synchAPICalls (urls,done) {
  var url = urls.pop();
	url = addProtocol(url);
  //check if address is valid.
  if (validate(url)){
	  
    // call the address.
  request({
		  uri: url,
		}, function(error, response, body) {
			if (error){
				results.push(url + ": No Response");
			}
		    var $ = cheerio.load(body);
			results.push(url + ": " + $("title").text());
			  if(urls.length){
				synchAPICalls(urls,done);
			  } else {
				done(results);
			  }
		});
  }else {
	  results.push(url + ": No Response");
	  if(urls.length){
				synchAPICalls(urls,done);
			  } else {
				done(results);
			  }
  }
}

app.listen(3000, function () {
  console.log('listening on port 3000...');
});

