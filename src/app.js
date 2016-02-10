'use strict';

var express = require('express');
var posts = require('./mock/posts.json');

var app = express();

app.set('view engine', 'jade'); //set view engine
app.set('views', __dirname + '/views'); //set view to folder path 
app.get('/', function (req, res){

	res.render('index');
	console.log("New access!");
});

app.get('/movie/:title?', function (req, res){
	var title = req.params.title;
	if (title === undefined){

		res.send("This is the movies page");
	} else {
	var selected_post = posts[title] || {};
	res.render('post', { post: selected_post});
	}
});

app.listen(3000, function(){

	console.log("Server started");
});