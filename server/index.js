const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
const express = require('express');
const uuid = require('uuid')

const app = express();

let rooms = {}
let roomIp = {'127.0.0.1': 'oiwejoiwejowef'}
let ipWs = {}

app.get('/', (req, res) => {
    res.send('Hello HTTPS!')
})
 
const server = https.createServer({
  cert: fs.readFileSync("cert.pem"),
  key: fs.readFileSync("key.pem")
},app);
const wss = new WebSocket.Server({ server });
 
wss.on('connection', function connection(ws) {

  ws.send("inicio")
  ws.on('message', function incoming(message) {
    [command, ...rest] = message.split(" ")
    if (command == "join"){
        rooms[rest[0]].users.push(ws)
    }
    else if (command == "create"){
        let id = uuid.v4()
        rooms[id] = {'host': rest[0], 'users': [ws]}
        ws.send("created "+id)
    }
    else if (command == "play"){
        let roomId = rest[0]
        if(roomId.id == '')
        rooms[roomId].users.forEach( user => {
            user.send('something');
        })
    }
    else if (command == "chat"){
        rooms[roomId].users.forEach( user => {
            user.send('something');
        })
    }
  });

});
 
server.listen(8080, function() {
    console.log('Listening on http://localhost:8080');
  });