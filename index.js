const WebSocket = require('ws');
const server = new WebSocket.Server({
    port: 8080
});

var clients = [];

console.log("server starting");

server.on('connection', function (ws) {
    console.log("connection");
    clients.push({socket: ws, name: null});

    ws.on('message', function (message) {
        if (message.startsWith("name:")) {
            message = message.slice("name:".length);
            client = getClient(ws);
            client.name = message;
            ws.name = message;
            console.log(ws.name);
            ws.send("accepted:" + client.name);
            updateClients();
        } else {
            clients.forEach(function (client) {
                senderName = getClient(ws).name;
                client.socket.send("log:" + senderName + ": " + message);
            });
        }
    });

    ws.onclose = function () {
        console.log(ws.name);
        //client = clients.find((x) => x.socket.name=ws.name);
        index = clients.findIndex((x) => {if(x.socket){
            return false;
        }
        return x.socket.name=ws.name});
        delete clients[index];
        //clients.pop(client);
        updateClients();
        console.log("disconnected " + ws.name);
    };
});

function getClient(socket) {
    return clients.find((x) => {
        return x.socket === socket;
    });
}

function updateClients() {
    clientsList = "";
    clients.forEach((x) => {
        if (x.name != null && x.socket != null) {
            clientsList += "<li>" + x.name + "</li>"
        }
    });
    clients.forEach(function (client) {
        client.socket.send("connected:" + clients.length);
        client.socket.send("users:" + clientsList);
    });
}