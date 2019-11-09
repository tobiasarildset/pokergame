const express = require('express');
const ngrok = require('ngrok');

const app = express();
const port = 9471;

var cardCount = [
    1,  2,  3,  4,  5,  6,  7,
    8,  9, 10, 11, 12, 13, 14,
   15, 16, 17, 18, 19, 20, 21,
   22, 23, 24, 25, 26, 27, 28,
   29, 30, 31, 32, 33, 34, 35,
   36, 37, 38, 39, 40, 41, 42,
   43, 44, 45, 46, 47, 48, 49,
   50, 51, 52
];

var currentCardCount = 0;

var tunnel;

function shuffle(array) {
    var currentIndex = array.length, tempoaryValue, randomIndex;
    while(0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        tempoaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = tempoaryValue;
    }

    return array;
}

shuffle(cardCount);

var currentPlayers = [];
var currentConnections = 0;

//var currentArrayPosition = Object.keys(currentPlayers).length;
var playerCards = [];

function getPlayerCards() {
    for(var i = 0; i < 2; i++) {
        playerCards[i] = cardCount[currentCardCount];
        currentCardCount++;
    }
    if(currentCardCount === 52) {
        currentCardCount = 0;
        shuffle(cardCount);
    }

    return playerCards;
}

function getCommunityCards() {
    for(var i = 0; i < 3; i++) {
        playerCards[i] = cardCount[currentCardCount];
        currentCardCount++;
    }
    if(currentCardCount === 52) {
        currentCardCount = 0;
        shuffle(cardCount);
    }

    return playerCards;
}

app.use(express.json());

app.get('/', (req, res) => {
    console.clear();
    console.log(req);
    console.log("GET REQUEST");
    res.send('This server does not accept GET requests');
});

app.post('/', (req, res) => {
    console.clear();
    console.log("SERVER: " + tunnel);
    console.log("REQUEST TYPE: POST");
    console.log("MESSAGE TYPE: " + req.body.type);
    console.log("MESSAGE DATA: " + req.body.typeData);
    console.log(/*"CURRENT PLAYERS:\n" + */currentPlayers);
    switch(req.body.type) {
        case "serverHandshake":
            res.send("HELLO");
            currentConnections++;
            console.log("Current Connections: " + currentConnections);
            break;
        case "newPlayer":
            var newPlayer = req.body.typeData;
            var playerCardArray = getPlayerCards();
            currentPlayers.push(newPlayer)
            console.log("Current players:\n" + currentPlayers);
            res.json(playerCardArray);
            break;
        case "getCommunityCards":
            var communityCardArray = getCommunityCards();
            res.json(communityCardArray);
            break;
        case "ping":
            res.send("PONG");
            break;
        case "currentPlayers":
            res.send(currentPlayers);
            break;
        case "disconnect":
            for(var i = 0; i < currentPlayers.length; i++) {
                if(currentPlayers[i] == req.body.typeData) {
                    currentPlayers.splice(i, 1);
                    break;
                }
            }
            currentConnections--;
            break;
        default:
            res.send("UNKNOWNDATATYPE");
            break;
    }
});

function startServer() {
    (async () => {
        tunnel = await ngrok.connect(port);

        console.log(tunnel);
    })();

    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });
}

startServer();