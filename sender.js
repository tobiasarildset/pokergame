const axios = require('axios').default;
const http = require('http');

const Agent = require('agentkeepalive');
const keepAliveAgent = new Agent({
    maxSockets: 100,
    maxFreeSockets: 10,
    timeout: 120000,
    freeSocketTimeout: 30000
});

const axiosInstance = axios.create({
    httpAgent: keepAliveAgent
});

var gameAddress;
var connectedToAServer = false;

function connectToServer(gameCode) {
    gameAddress = gameCode;
    axiosInstance({
        url: `https://${gameAddress}.ngrok.io`,
        method: "POST",
        httpAgent: new http.Agent({ keepAlive: true }),
        data: {
            type: "serverHandshake",
            typeData: "Hiya server!"
        }
    }).then((response) => {
        console.log(response.data);
        connectedToAServer = true;
    }).catch((error) => {
        console.log(error);
        connectedToAServer = false;
    });
}

function ping() {
    var startOfPing = Date.now();
    axiosInstance.post(`https://${gameAddress}.ngrok.io`, {
        type: "ping",
        typeData: "PING"
    }).then(() => {
        var endOfPing = Date.now();
        var pingTime = Math.floor((endOfPing - startOfPing) / 10);
        console.log(pingTime);
        return pingTime;
    }).catch((err) => {
        console.log(err);
        return err;
    });
}

function sendMessageToServer(messageType, message) { 
    return axiosInstance.post(`https://${gameAddress}.ngrok.io`, {
        type: messageType,
        typeData: message
    })
    .then((res) => {
        return res.data;
    })
    .catch((error) => {
        console.log(error);
    });
}