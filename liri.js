require("dotenv").config();
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var fs = require('fs');
var keys = require("./keys.js");
var request = require('request');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
//var inquirer = require('inquirer');
var command = process.argv[2];

if (command === 'do-what-it-says') {
   runFromFile('random.txt');
} else if (command === 'my-tweets') {
    searchTwitter();
} else if (command === 'spotify-this-song') {
    searchSpotify(process.argv[3])
} else if (command === 'movie-this') {
   searchMovie(process.argv[3]);
} else {
    console.log('Error: Unrecognized command.')
}

//functions

//function to query spotify api
//takes a song name as a parameter
function searchSpotify(songName) {
    if (songName === undefined) {
        songName = process.argv[3];
    }
    if (songName === undefined) {
        var track = '3DYVWvPh3kGwPasp7yjahc';
        spotify.request('https://api.spotify.com/v1/tracks/' + track).then(function(response) {
            //Artists
            console.log('Artist(s): ' + response.artists[0].name);
            //song name
            console.log('Song Name: ' + response.name);
            //preview link
            console.log('Preivew: ' + response.preview_url);
            //album name
            console.log('Album: ' + response.album.name);
        }).catch(function(error) {
            console.log(error);
        });
    } else {
        spotify.search({type: 'track', query: songName}).then(function(response) {
            // * Artist(s)
            console.log('Artist(s): ' + response.tracks.items[0].artists[0].name);
            // * The song's name
            console.log('Song Name: ' + response.tracks.items[0].name)
            // * A preview link of the song from Spotify
            console.log('Preview: ' + response.tracks.items[0].external_urls.spotify)
            // * The album that the song is from
            console.log('Album: ' + response.tracks.items[0].album.name)
        }).catch(function(error) {
            console.log(error);
        }); 
    }
}
//function to query omdb api
//takes a movie name as a paramenter
function searchMovie(movie) {
    if (movie === undefined) {
        movie = process.argv[3];
    }
    if (movie === undefined) {
        movie = 'Mr. Nobody';
    }
    request('http://www.omdbapi.com/?apikey=e65c2f&t=' + movie, function(error, response) {
        if (!error) {
            jsonResponse = JSON.parse(response.body);
           // * Title of the movie.
            console.log('Title: ' + jsonResponse.Title);
            // * Year the movie came out.
            console.log('Year: ' + jsonResponse.Year);
            // * IMDB Rating of the movie.
            console.log('IMDB Rating: ' + jsonResponse.imdbRating); 
            // * Rotten Tomatoes Rating of the movie.
            console.log('Rotten Tomatoes Rating: ' + jsonResponse.Ratings[1].Value);
            // * Country where the movie was produced.
            console.log('Country: ' + jsonResponse.Country);
            // * Language of the movie.
            console.log('Language: ' + jsonResponse.Language);
            // * Plot of the movie.
            console.log('Plot: ' + jsonResponse.Plot);
            // * Actors in the movie.
            console.log('Actors: ' + jsonResponse.Actors);
        } else {
            console.log(error);
        }
    });
}
//function to query twitter api
function searchTwitter() {
    var params = {screen_name: 'spellegrini156'};
    client.get('statuses/user_timeline', params, function(error, tweets) {
        if (!error) {
            var i = 0;
            console.log('\nHere are your last 20 tweets:\n')
            while (i < tweets.length && i <= 20) {
                console.log(tweets[i].text)
                console.log(tweets[i].created_at);
                console.log();
                i++;
            }
        } else {
            console.log("There was an error:");
            console.log(error);
        }
    });
}
//function to execute command from file
//do-what-it-says
//accepts a filename string as an argument
function runFromFile(filename) {
    fs.readFile(filename, 'utf8', function(error, data) {
        if (error) {
            console.log(error);
        } else {
            data = data.split(',');
            command = data[0];
            if (command === 'spotify-this-song') {
                searchSpotify(data[1]);
            } else if (command === 'movie-this') {
                searchMovie(data[1]);
            } else if (command === 'my-tweets') {
                searchTwitter();
            } else {
                console.log('Error: Unrecognized command.');
            }
        }
    });
}