'use strict';

var express = require('express');
var request  = require('request');
var setPromise = require('node-promise').Promise;

/*Promises */
var promise = new setPromise();
var promise1 = new setPromise();
var movie;
var movie1;
var avg_r;

var port = process.env.PORT || 8080;


var app = express();


app.set('view engine', 'jade'); //set view engine
app.set('views', __dirname + '/views'); //set view to folder path 
app.use(express.static(__dirname + '/public'));

var movie_id;
var tmdb_id;

app.get('/', function (req, res){  //Index

res.setHeader('Content-Type', 'text/html; charset=utf-8');
res.setHeader('Connection', 'Transfer-Encoding');

console.log("ACCESSING index");

request({ 
	url: "http://api.themoviedb.org/3/movie/popular?page=1&api_key=00c00c9741ab3a01bf6c16625e27a800",
	json: true
	}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    	
    var movies = body.results;
    var set1 = movies.splice(0,3);
    var set2 = movies.splice(3,3);
    var set3 = movies.splice(6,3);
    var set4 = movies.splice(9,2);	
	res.render('index', {set1: set1 , set2: set2 , set3: set3, set4: set4});

	};

});


}); //end '/'

app.get('/int/', function (req, res){  //International

var collage;
var pop;
var now;
var soon;

console.log("ACCESSING int");
request({  //pop
	url: "http://api.themoviedb.org/3/movie/popular?page=1&api_key=00c00c9741ab3a01bf6c16625e27a800",
	json: true
	}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var movies = body.results;
    collage = movies.splice(0,3);
    pop = movies.splice(3,5);
	movie_id = body.id;
  	promise.resolve(movie_id);


    };


});

promise.then(function(movie_id) { //now
	promise = new setPromise(); //reset promise

request({ 
	url: "http://api.themoviedb.org/3/movie/upcoming?page=1&api_key=00c00c9741ab3a01bf6c16625e27a800",
	json: true
	}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	soon = body.results;
  	var splitter = body.results;
  	soon = splitter.splice(0,10); //splice results into 10.
	movie_id = body.id;
	promise1.resolve(movie_id);

    };    
});

}); //end promise


promise.then(function(movie_id) { //soon
	promise1 = new setPromise(); //reset promise
	request({ 
	url: "http://api.themoviedb.org/3/movie/now_playing?page=1&api_key=00c00c9741ab3a01bf6c16625e27a800",
	json: true
	}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	var splitter = body.results;
  	now = splitter.splice(0,10) 
  	res.render('int', { collage: collage , pop: pop,  now: now, soon: soon})  

    };
});

});

}); //end /int/



app.get('/movie/:title', function (req, res){  //Movie

var title = req.params.title;

console.log("ACCESSING movie: " + title );
var ourl =  "http://www.omdbapi.com/?t=";
var otype = "&y=&tomatoes=true&plot=short&r=json";
var tapi = "&api_key=00c00c9741ab3a01bf6c16625e27a800";

res.setHeader('Content-Type', 'text/html; charset=utf-8');
res.setHeader('Connection', 'Transfer-Encoding');

//omdb
request({ 
	url: ourl+title+otype,
	json: true
	}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    movie_id = body.imdbID;
   	movie = body;
    promise.resolve(movie_id);
      } else { res.write("404 Not available!")
  				res.end()
  			};
});



//tmbd
promise.then(function(movie_id) {
	promise = new setPromise(); //reset promise

	request({ url : "https://api.themoviedb.org/3/find/" + movie_id + "?external_source=imdb_id&api_key=00c00c9741ab3a01bf6c16625e27a800",
		json: true
		}, function (error, response, body) {
	 	if (!error && response.statusCode == 200) {
	 		movie1 = body.movie_results[0];
	 		tmdb_id = body.movie_results[0].id;
	 	    promise1.resolve(tmdb_id);
			} else { res.send("Not available p");
						res.end();
			};
			
			});
}); //end promise



promise.then(function(tmdb_id) {
	promise1 = new setPromise(); //reset promise

	request({ url : "https://api.themoviedb.org/3/movie/" + tmdb_id +"?api_key=00c00c9741ab3a01bf6c16625e27a800&append_to_response=trailers,reviews,credits,keywords,videos,similar",
		json: true
		}, function (error, response, body) {
	 	if (!error && response.statusCode == 200) {

	 		movie1 = body;
	 		var trailer_url = movie1.trailers.youtube[0].source; //trailer
	 		var reviews = movie1.reviews.results;
	 		var similars = movie1.similar.results;
	 		var videos = movie1.videos.results;
	 		var tags = [];
	 		var tags_object = body.keywords.keywords;
	 		for (var i = 0; i<tags_object.length; i++){
	 			tags.push(tags_object[i].name);
	 		}
	 		


	 		avg_r =  (parseFloat(movie.imdbRating) + parseFloat(movie.tomatoRating) + parseFloat(movie.Metascore)/10 + parseFloat(movie1.vote_average))/4;
	 		avg_r = avg_r.toPrecision(2);
			res.render('movie', { movie: movie, movie1: movie1, tags: tags, avg: avg_r, trailer: trailer_url, reviews: reviews , similars: similars, videos: videos}); 


			} else { res.send("Not available p1");
						res.end();
			};
			
			});
}); //end promise1

}); //end movie/:title


app.get('/int/popular/', function (req, res){  //int popular


res.setHeader('Content-Type', 'text/html; charset=utf-8');
res.setHeader('Connection', 'Transfer-Encoding');

console.log("ACCESSING int/popular");

request({ 
	url: "http://api.themoviedb.org/3/movie/popular?page=1&api_key=00c00c9741ab3a01bf6c16625e27a800",
	json: true
	}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	var movies = body.results;
  	var page = 1;
 	var list_link = 'Popular'
    var list_name = 'Popular'	
  	res.render('pop', {movies: movies, list_link: list_link, list_name: list_name, page: page} )
    };
});


}); //end popular  this.


app.get('/int/popular/:page', function (req, res){ 

var page = req.params.page;

res.setHeader('Content-Type', 'text/html; charset=utf-8');
res.setHeader('Connection', 'Transfer-Encoding');

console.log("ACCESSING" + page);

request({ 
	url: "http://api.themoviedb.org/3/movie/popular?page=" + page +"&api_key=00c00c9741ab3a01bf6c16625e27a800",
	json: true
	}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	var movies = body.results;
 	var list_link = 'Popular'
    var list_name = 'Popular'
    page = parseInt(page);	
  	res.render('pop', {movies: movies, list_link: list_link, list_name: list_name, page: page} )
    };
});


}); //end int/popular/:page


app.get('/int/most_voted/', function (req, res){  //Most Voted

res.setHeader('Content-Type', 'text/html; charset=utf-8');
res.setHeader('Connection', 'Transfer-Encoding');

console.log("ACCESSING release");

request({ 
	url: "http://api.themoviedb.org/3/discover/movie?sort_by=vote_count.desc&page=1&api_key=00c00c9741ab3a01bf6c16625e27a800",
	json: true
	}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
 	var movies = body.results;
	res.render('most_voted', {movies: movies} );


    };
});


}); //end most voted.



app.get('/int/top_rated/', function (req, res){  //Top Rated


res.setHeader('Content-Type', 'text/html; charset=utf-8');
res.setHeader('Connection', 'Transfer-Encoding');

console.log("ACCESSING Top Rated");

request({ 
	url: "http://api.themoviedb.org/3/movie/top_rated?page=1&api_key=00c00c9741ab3a01bf6c16625e27a800",
	json: true
	}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	var movies = body.results;
  	var list_link = 'Top_Rated';
    var list_name = 'Top Rated'	;
    var page = 1;
  	res.render('top', {movies: movies, list_link: list_link, list_name: list_name, page: page} );

    };
});

}); // end top_rated

app.get('/int/top_rated/:page', function (req, res){ 

var page = req.params.page;

res.setHeader('Content-Type', 'text/html; charset=utf-8');
res.setHeader('Connection', 'Transfer-Encoding');

console.log("ACCESSING Top_Rated:" + page);

request({ 
	url: "http://api.themoviedb.org/3/movie/top_rated?page=" + page +"&api_key=00c00c9741ab3a01bf6c16625e27a800",
	json: true
	}, function (error, response, body) {

  if (!error && response.statusCode == 200) {
  	var movies = body.results;
  	var list_link = 'Top_Rated';
    var list_name = 'Top Rated'	;
    page = parseInt(page);	
  	res.render('top', {movies: movies, list_link: list_link, list_name: list_name, page: page} );

    };
});


});  // end top_rated:page



app.get('/int/now/', function (req, res){  //Int Now


res.setHeader('Content-Type', 'text/html; charset=utf-8');
res.setHeader('Connection', 'Transfer-Encoding');

console.log("ACCESSING /now");

request({ 
	url: "http://api.themoviedb.org/3/movie/now_playing?page=1&api_key=00c00c9741ab3a01bf6c16625e27a800",
	json: true
	}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	var movies = body.results;
  	var orbit = [];
  	for(var i = 0; i < 5; i++){
  		orbit.push(movies[Math.floor(Math.random() * movies.length)]); //get collage data
  	}
  	var page = 1;
  	res.render('now' , {movies: movies, orbit: orbit, page:page});
    };
});


}); // end now showing

app.get('/int/now/:page', function (req, res){ 

var page = req.params.page;

res.setHeader('Content-Type', 'text/html; charset=utf-8');
res.setHeader('Connection', 'Transfer-Encoding');

console.log("ACCESSING" + page);

request({ 
	url: "http://api.themoviedb.org/3/movie/now_playing?page=" + page +"&api_key=00c00c9741ab3a01bf6c16625e27a800",
	json: true
	}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	var movies = body.results;
  	var orbit = [];
  	for(var i = 0; i < 5; i++){

  		orbit.push(movies[Math.floor(Math.random() * movies.length)]);

  	}
  	page = parseInt(page);
  	res.render('now' , {movies: movies, orbit: orbit, page:page});
  }
});

});  // end now showing:page


app.get('/int/soon/', function (req, res){  //Soon

res.setHeader('Content-Type', 'text/html; charset=utf-8');
res.setHeader('Connection', 'Transfer-Encoding');

console.log("ACCESSING /soon");

request({ 
	url: "http://api.themoviedb.org/3/movie/upcoming?page=1&api_key=00c00c9741ab3a01bf6c16625e27a800",
	json: true
	}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	var soon = body.results;
  	var page = 1;
  	res.render('soon', { soon: soon, page: page})  

    };
});

}); // end coming_soon

app.get('/soon/:page', function (req, res){ 

var page = req.params.page;

res.setHeader('Content-Type', 'text/html; charset=utf-8');
res.setHeader('Connection', 'Transfer-Encoding');

console.log("ACCESSING" + page);

request({ 
	url: "http://api.themoviedb.org/3/movie/upcoming?page=" + page +"&api_key=00c00c9741ab3a01bf6c16625e27a800",
	json: true
	}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	var soon = body.results;
  	page = parseInt(page)
  	res.render('soon', { soon: soon, page: page})  

    };
});


});  // end coming_soon:page

app.get('/int/top_grossing/', function (req, res){  //Int/ Top Grossing


res.setHeader('Content-Type', 'text/html; charset=utf-8');
res.setHeader('Connection', 'Transfer-Encoding');

console.log("ACCESSING Top Grossing");

request({ 
	url: "http://api.themoviedb.org/3/discover/movie?sort_by=revenue.desc&api_key=00c00c9741ab3a01bf6c16625e27a800",
	json: true
	}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	var movies = body.results;
  	var list_link = 'Top_Grossing';
    var list_name = 'Top Grossing'	;
  	res.render('pop', {movies: movies, list_link: list_link, list_name: list_name} );


    };
});

}); //end int boxoffice



app.get('/bol/', function (req, res){  //Bollywood

var top;
var gross;

request({  //gross
	url: "https://api.cinemalytics.com/v1/analytics/TopGrossedMovies/?auth_token=ED96DB2E3C0F6942FA699E2AD91811C9",
	json: true
	}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    gross = body;
  	promise.resolve(movie_id);

    };
});

promise.then(function(movie_id) { //rated
	promise = new setPromise(); //reset promise

request({ 
	url: "https://api.cinemalytics.com/v1/analytics/TopMovies/?auth_token=ED96DB2E3C0F6942FA699E2AD91811C9",
	json: true
	}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	top = body

  	res.render('bol', {top: top, gross: gross});


    };    
});

}); //end promise

}); //end /bol/

app.listen(port , function(){

	console.log("Running now on port: " + port);
});


