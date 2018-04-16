/**
 * takes a command and preforms a search on one of 3 APIs
 * phase one: get input 
 *
 * input 1: check input 
 * phase two: call API
 * check out fall through
 *      spotify get search option 
 *      configuration for request: 
 * phase three: get data and console.log it out 
 * 
 */ 
require('dotenv').config()
const Twitter = require("twitter")
const Spotify = require("node-spotify-api")
const request = require("request")
const keys = require("./keys")
const fs = require("fs")
const DEFAULT_SCREEN_NAME = "nodejs"
const DEFAULT_SONG_NAME = "All the Small Things"
const DEFAULT_MOVIE_NAME = "Armageddon"




let command = process.argv[2];
let option = process.argv[3];

checkCommand(command)

function checkCommand(command) {
    switch (command){
        case "my-tweets":
            callTwitter()
            break;
        case "spotify-this-song":
            callSpotify()
            break;
        case "movie-this":
            callOmdb()
            break;
        case "do-what-it-says":
            callWhatItSays()
            break;
        default:
            console.log("Try Something New")
    }
}

function callTwitter(){
    const twitter = new Twitter(keys.twitter)
    const screen_name = option ? option: DEFAULT_SCREEN_NAME
    // condtion ? if true : value return if false   

    const params = {screen_name, count:20};
    console.log("makingcall")
    twitter.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
            console.log("error", error);
        }else{
            // const filterTweets = tweets.map(function(tweet){
                //     return tweet.text
                // })
            const filterTweets = tweets.map( tweet => tweet.text)
            console.log(filterTweets)
        }
    });
    console.log("call finished")
}

function callSpotify(){
    const spotify = new Spotify(keys.spotify)
    const songName = option ? option: DEFAULT_SONG_NAME

    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        } else {
            console.log("Track: " + data.tracks.items[0].name)
            console.log("Album Name: " + data.tracks.items[0].album.name)
            console.log("Artist: " + data.tracks.items[0].artists[0].name)
            console.log("Link: " + data.tracks.items[0].external_urls.spotify)
        }

    })
};

function callOmdb(){
    console.log("movie")
const movieName = option ? option: DEFAULT_MOVIE_NAME
const queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
console.log(queryUrl)

request(queryUrl, function(error, response, body){
    if (error){
        console.log(error)
    }else{
        // console.log("Title: " + JSON.parse(body).Title)
        var eg = console.log(
        `Name: ${JSON.parse(body).Title}` +
        `\nYear: ${JSON.parse(body).Year}` + 
        `\nMovie Rating: ${JSON.parse(body).Rated}` + 
        `\nRotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value}` +
        `\nCountry Produced: ${JSON.parse(body).Country}` + 
        `\nLanguage: ${JSON.parse(body).Language}` +
        `\nPlot: ${JSON.parse(body).Plot}` +
        `\nActor: ${JSON.parse(body).Actors}`)
    }
});
}

function callWhatItSays(){
    console.log("what does it say")
    fs.readFile("random.txt", "utf8", function(err,data){
        if(err){
            console.log(Error)
        } else {

            const arr = data.split(",")

            command = arr[0];
            option = arr[1];
            
            console.log("YOU SHALL NOW LISTEN TO THIS!!!!... AND YOU WILL LIKE IT!!")

            callSpotify()
        }
    })

}


// var eg = console.log(`
// Name: ${whatever}
// `)