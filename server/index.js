const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
const express = require('express');
const uuid = require('uuid')

const app = express();

let rooms = {}

let userRoom = new Map()

app.get('/', (req, res) => {
  res.send('Hello HTTPS!')
})

const server = https.createServer({
  cert: fs.readFileSync("../../cert/live/amasync.tk/chain.pem"),
  key: fs.readFileSync("../../cert/live/amasync.tk/privkey.pem")
}, app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {


  ws.on('message', function incoming(message) {
    [command, ...rest] = message.split(" ")

    if (command == "join") {
      console.log(rest, rooms)
      userRoom.set(ws, rest[0])
      rooms[rest[0]].users.push(ws)
      ws.send("joined")
    }

    else if (command == "create") {
      let id = uuid.v4()
      userRoom.set(ws, id)

      rooms[id] = { 'host': ws, 'users': [] }

      console.log('server: creating room')
      ws.send("created " + id+" "+ rest[0]+" "+ rest[1])
    }

    else if (command == "control") {
      let roomId = userRoom.get(ws)

      rooms[roomId].users.forEach(user => {
        console.log(rest[0])
        if(rest[1]) user.send(rest[0]+' '+ rest[1]);
        else user.send(rest[0]);
      })
    }

    else if (command == "restart") {
      let roomId = userRoom.get(ws)

      let host=rooms[roomId].host
      host.send("hosttime roomId")
    }

    else if (command=="hosttime"){
      let roomId = rest[0]
      let time=rest[1]
      rooms[roomId].users.forEach(user => {
        console.log("mandando tiempo")
        user.send("move"+' '+ time);
      })
    }

    else if (command == "chat") {
      rooms[roomId].users.forEach(user => {
        user.send('something');
      })
    }
  });

  ws.on('close', () => {
    console.log('salio')
    /*  let room=rooms[userRoom.get(ws)]
     room.users.splice( room.users.indexOf(ws),1)
     if (!room.users.length)
     {
       delete rooms[userRoom.get(ws)]
     }
     userRoom.delete(ws)
     console.log(rooms)
 
  
 */})
});

server.listen(8080, function () {
  console.log('Listening on http://localhost:8080');
});