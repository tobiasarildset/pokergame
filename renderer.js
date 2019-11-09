// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const cardResult = new whatCard;

var messageResponse;

var cards = [];

var pingInterval;

var playersCurrentlyConnectedToTheServer = [];

var lastPingWasSuccess = false;

var yourCards = {};
function init(cardArray) {
    for(var i = 0; i < cardArray.length; i++) {
        var whatCardResult = cardResult.get(cardArray[i]);
        
        yourCards[i] = whatCardResult;
    }

    for(var loopVar = 0; loopVar < 2; loopVar++) {
        var img = $("<img class=\"card\" style=\"margin: 10px;\">");
        img.attr('src', "res/" + yourCards[loopVar].file + ".png");
        img.attr('height', "75px");
        img.attr('width', "auto");
        img.appendTo("#myCards")
    }
}

function renderCommunityCards(communityCardArray) {
    for(var i = 0; i < communityCardArray.length; i++) {
        var whatCardResult = cardResult.get(communityCardArray[i]);
        
        yourCards[i] = whatCardResult;
    }

    for(var loopVar = 0; loopVar < communityCardArray.length; loopVar++) {
        var img = $("<img class=\"card\" style=\"margin: 5px;\">");
        img.attr('src', "res/" + yourCards[loopVar].file + ".png");
        img.attr('height', "75px");
        img.attr('width', "auto");
        img.appendTo("#communityCards");
    }
}

function startGameServer() {
    startServer();
}

function connectToGameServer(address) {
    connectToServer(address);
}

async function sendMessage(messageType, message) {
    messageResponse = await sendMessageToServer(messageType, message);

    return messageResponse;
}

function pingServer() {
    ping();
}

function refreshCards() {
    $("#myCards").empty();
    init();
    for(var loopVar = 0; loopVar < 2; loopVar++) {
        var img = $("<img class=\"card\" style=\"margin: 10px;\">");
        img.attr('src', "res/" + yourCards[loopVar].file + ".png");
        img.attr('height', "75px");
        img.attr('width', "auto");
        img.appendTo("#myCards")
    }
}

function serverConnectCodeMsg(event, data) {
    SERVERCONNECTCODE = data;
    connectToGameServer(SERVERCONNECTCODE);
}

async function serverUsernameMsg(event, data) {
    SERVERUSERNAME = data;
    var cards = await sendMessage("newPlayer", SERVERUSERNAME);

    init(cards);

    if(SERVERCONNECTCODE != "" && SERVERUSERNAME != "") {
        pingInterval = setInterval(() => {
            pingServer();
            serverCurrentPlayersMsg();
        }, 500);
    }
}

async function serverDisconnectMsg() { await sendMessage("disconnect", SERVERUSERNAME); }

async function serverGetCommunityCardsMsg() {
    var communityCards = await sendMessage("getCommunityCards");

    renderCommunityCards(communityCards);
}

async function serverCurrentPlayersMsg() {
    var currentPlayers = await sendMessage("currentPlayers", "");

    playersCurrentlyConnectedToTheServer = currentPlayers;
}

var TEMPCARDS = [ 1, 51 ];
//var TEMPCOMMUNITYCARDS = [ 4, 23, 32, 12, 43 ];

init(TEMPCARDS);
//renderCommunityCards(TEMPCOMMUNITYCARDS);