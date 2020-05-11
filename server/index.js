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
        console.log(rest,rooms)
        rooms[rest[0]].users.push(ws)
        ws.send("correcto 1")
    }
    else if (command == "create"){
        let id = uuid.v4()
        ws.id_room=id
        rooms[id] = {'host': rest[0], 'users': [ws]}
        console.log('server: creating room')
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

  ws.on('close', ()=>{
    console.log("me sali")
    let room=rooms[ws.id_room]
    room.users.splice( room.users.indexOf(ws))
    if (!room.users.length)
    {
      delete rooms[ws.id_room].users
    }
    console.log(rooms)

  })

});
 
server.listen(8080, function() {
    console.log('Listening on http://localhost:8080');
  });