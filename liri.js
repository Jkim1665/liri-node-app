//to read and set any environment variables with the dotenv package:
require("dotenv").config();
//Add code required to import the keys.js file and store it in a variable.
let fs = require("fs");
let request = require('request');
let moment = require('moment');
let keys = require("./keys");
let Spotify = require('node-spotify-api');
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});

//added to format table 
var cTable = require('console.table');

let command = process.argv[2];
let parameter = process.argv[3];

// function switchCase
function switchCase() {
    switch (command) {
        case 'concert-this':
            bandsInTown(parameter);
            break;
        case 'spotify-this-song':
            spotifySong(parameter);
            break;
        case 'movie-this':
            omdbInfo(parameter);
            break;
        case 'do-what-it-says':
            getRandom();
            break;
        default:
            display("Invalid. Error.");
            break;
    }
};

//Bands
function bandsInTown(parameter) {
    if ('concert-this') {
        var artist = process.argv.slice(3).join(" ")
        console.log(artist);
        var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

        request(queryURL, function (error, response, body) {
            if (error) console.log(error);
            var result = JSON.parse(body)[0];
            console.log("Venue name " + result.venue.name);
            console.log("Venue location " + result.venue.city);
            console.log("Date of Event " + moment(result.datetime).format("MM/DD/YYYY"));
        });
    }
};

function spotifySong(parameter) {
    if ('spotify-this-song') {
        var songName = process.argv.slice(3).join(" ");
        console.log(songName);
        if (songName == undefined) {
            songName = "The sign by Ace of Base";
        }
        spotify.search({ type: 'track', query: songName, limit: 10 })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (err) {
                console.log(err);
            })


        var tableArray = [];

        for (var i = 0; i < data.tracks.items.length; i++) {
            var result = {
                artist: data.tracks.items[i].album.artists[0].name,
                album_name: data.tracks.items[i].album.name,
                song_name: data.tracks.items[i].name,
                preview_url: data.tracks.items[i].preview_url
            }
            tableArray.push(result);
        }
        var table = cTable.getTable(tableArray);
        console.log(table);
    });
}
};
function omdbInfo(parameter) {
    if ('movie-this') {
        var movieName = process.argv.slice(3).join(" ");
        if (movieName == undefined) {
            movieName = "Mr. Nobody";
        }
        request('http://www.omdbapi.com/?i=tt3896198&apikey=55e8eecb&t=' + process.argv[3], function (error, response, body) {

            var result = JSON.parse(body);
            console.log("Title :" + result.Title);
            console.log("Year :" + result.Released);
            console.log("IMDB Rating :" + result.imdbRating);
            console.log("Rotten Tomatoes :" + result.Ratings[1].Value);
            console.log("Country :" + result.Country);
            console.log("Language :" + result.Language);
            console.log("Movie Plot :" + result.Plot);
            console.log("Actors :" + result.Actors);
        });
    }
};

function getRandom() {
    if ("do-what-it-says") {
        console.log("do what it says");
    }
}

function askLiri() {
    inquirer.prompt([
        {
            type: 'list',
            message: "Call me Liri, what you like me to do?",
            name: 'list',
            choices: ["Find Events", "Spotify a song", "Get information on a movie", 'do what it says']
        }
    ]).then(function (command) {
        console.log(command.list);
        if (command.list == 'Look for Concerts') {
            //Events Here
            liri('concert-this');
        } else if (command.list == 'Spotify a song') {
            //Spotify stuff here
            inquirer.prompt([
                {
                    type: 'input',
                    message: 'Which song would you like to get information on Spotify?',
                    name: 'input'
                }
            ]).then(function (spot) {
                liri('spotify-this-song', spot.input);
            })
        } else if (command.list == 'Get information on a movie') {
            // movie information here
            inquirer.prompt([
                {
                    type: 'input',
                    message: 'What movie would you like to get information on?',
                    name: 'movie'
                }
            ]).then(function (mov) {
                liri('movie-this', mov.movie);
            })
        } else {
            liri("do-what-it-says");
        }
    })
}

askLiri();

function liri(command, name) {
    // if command is do-what-it-says
    if (command == 'do-what-it-says') {
        fs.readFile('random.txt', 'utf8', function (error, data) {
            if (error) throw error;
            var a = data.split(',');
            var b = a[0];
            var c = a[1];
            //calling the function if the command is 'do-what-it-says'
            switchCase(b, c);
        })
    } else {
        //function that take in everything except the do-what-liri-says
        switchCase(command, name);
    }
};


    //Make it so liri.js can take in one of the following commands:
// concert-this, spotify-this-song, movie-this, do-what-it-says
//take in command line argument for concert-this <artist/band name here> 
//this should search the bands in Town artists events API
//specifically for an artist and render info about each event to the terminal
//Name of the venue
//Venue location
//Date of the Event (use moment to format this as "MM/DD/YYYY")
//--------------------------------------code below--------------------------------------------
