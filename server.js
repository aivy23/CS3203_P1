var express = require('express');
var app = express();
//var bodyParser = require('body-parser'); 
// ^ no longer needed, built into express now.
var port = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');

// pull in given json and parse
let data = fs.readFileSync(path.resolve(__dirname, 'favs.json'));
let tweets = JSON.parse(data);
let tweetCount = 4; // used as a counter because we always have
                    // 5 elements to start (indeces 0-4)

// simple random number generator for setting a user: id
function getRandomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

app.use(express.static(__dirname));
// allow for proper parsing 
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// show tweets handler
app.get('/tweets', function(req, res) {
    var allTweets = [];
    // make a new array of just the info we need
    for (let t of tweets) {
        const newTweet = new Object({
            created_at: t.created_at,
            text: t.text
        });
        allTweets.push(newTweet);
    }
    // respond with new array
    res.send(allTweets);
});
// again, making a new array of just user: ids
app.get('/ids', function(req, res) {
    var allTweets = [];
    for (let t of tweets) {
        const newTweet = new Object({
            id: t.user.id
        });
        allTweets.push(newTweet);
    }
    res.send(allTweets);
});
// find and match the user id and sending corresponding tweet
app.post('/tweets/user', function(req, res) {
    var userID = req.body.id;

    for (let t of tweets) {
        // console.log(userID); // used for debugging
        // console.log(t.user.id);
        if (userID == t.user.id) { // this took a bit to fugure out
            const newTweet = new Object({
                created_at: t.created_at,
                text: t.text
            });
            // Same as first getter, but just send one tweet
            res.send(newTweet);
            return;
        }
    }
    // this allows us to know if it wasn't found
    res.send('null');
});
// taking in certain pieces, and adding arbitray others
app.post('/tweets/new', function(req, res) {
    var userTxt = req.body.text;
    var tweetID = req.body.id;

    const newTweet = new Object({
        text: userTxt,
        id: tweetID,
        user: {}
    });
    tweetCount++;
    tweets.push(newTweet);
    tweets[tweetCount].user.id = getRandomInt(0, 10000000); // set random id
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today = new Date(); 
    var date = today.toLocaleDateString("en-us", options) + ' ' + today.getTime().toString();
    tweets[tweetCount].created_at = date.toString(); // construct current date, a bit off format
    res.send('success');                            //  from rest
});
// Changing the screen name
app.put('/tweets/name', function(req, res) {
    var name = req.body.name;
    var screenName = req.body.screen_name;

    var count = 0;
    for (let t of tweets) {
        // console.log(userID);
        // console.log(t.user.id);
        if (name == t.user.name) {
            tweets[count].user.screen_name = screenName;
            // console.log(tweets[count].user.screen_name);
            res.send(tweets[count].user.screen_name);
            return;
        }
        count++;
    }
});
// Removing given tweet by tweet id, ajax request shows updated list
app.delete('/tweets/delete', function(req, res) {
    var id = req.body.id;

    var count = 0;
    for (let t of tweets) {
        if (id == t.id) {
            // console.log('yes');
            tweets.splice(count, 1);
            tweetCount--;
            return;
        }
        count++;
        console.log(tweets);
        res.send('null');
    }
});
// listennnn
app.listen(port, function() {
    console.log('App listening on port ' + port);
});
