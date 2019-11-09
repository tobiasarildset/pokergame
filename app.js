const ngrok = require('ngrok');

var playersToJoin = playersCurrentlyConnectedToTheServer;

$(document).ready(() => {
    //$("#mainMenu").hide();
    //$("#game").show();
    function updateCurrentPlayers() {
        $("#currentPlayersCount").html(playersToJoin.length);
        $("#currentPlayersList").empty();
        playersToJoin.forEach((value) => {
          $("#currentPlayersList").append("<li style=\"margin: 0; padding: 0;\"><h3 style=\"padding: 0; margin: 0; padding-top: 5px;\">" + value + "</h3></li>");
        });
    }
    setInterval(() => {
        if(disconnectCommand) {
            serverDisconnectMsg();
            $("#myCards").empty();
            $("#communityCards").empty();
            $("#game").hide();
            SERVERUSERNAME = "";
            SERVERCONNECTCODE = "";
            clearInterval(pingInterval);
            connectedToAServer = false;
            disconnectCommand = false;
        }
    }, 1);
    setInterval(() => {
        playersToJoin = playersCurrentlyConnectedToTheServer;
        updateCurrentPlayers();
    }, 1);
    setInterval(() => {
        /*if(connectedToAServer) {
            $("#mainMenu").hide();
            $("#game").show();
        } else {
            $("#mainMenu").show();
            $("#game").hide();
        }*/
    }, 1);
    $(document).keydown((event) => {
        if(event.code == "Tab") {
            // Tab pressed
            $("#currentServerPlayers").show();
        } else {
            // Not tab pressed
        }
    });
    $(document).keyup((event) => {
        if(event.code == "Tab") {
            // Tab released
            $("#currentServerPlayers").hide();
        } else {
            // Not tab released
        }
    });
    $("#newCards").click(() => {
        refreshCards();
    });
    $("#joinButton").click(() => {
        electron.ipcRenderer.send("openServerWindow");
    });
    $("#createServerButton").click(() => {
        electron.ipcRenderer.send("openServerCreateWindow");
    });
    $("#betButton").click(() => {
        if($("#betInput").val() <= $("#moneyAmount").attr("value")){
            $("#betInput").val() = "";
            console.log("YES");
        } else {
            console.log("NO");
        }
    });
    $("#quitButton").click(() => {
        ngrok.kill();
        serverDisconnectMsg(SERVERUSERNAME);
        electron.remote.app.quit();
    });
});