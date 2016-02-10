'use strict';

var express = require('express');
var request  = require('request');
var url =  "http://www.omdbapi.com/?t=";
var type = "&y=&tomatoes=true&plot=short&r=json";

var content;
var app = express();

app.get('/int/:title', function (req, res){

var title = req.params.title;

request(url+title+type, function (error, response, body) {
	console.log(title);
  if (!error && response.statusCode == 200) {
    content = body; //create error segment later
      }
 res.send(content);
});

});

app.listen(8080 , function(){
	
	console.log("running now");
});


