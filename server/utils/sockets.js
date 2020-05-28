const WebSocket = require("ws");
const rooms = require("./rooms");

const PROTOCOL = {
  JOIN: "join",
  CREATE: "create",
  CREATED: "created",
  JOINED: "joined",
  PLAY: "play",
  PAUSE: "pause",
  MOVE:"move",
  RESTART:"restart",
  HOSTTIME:"hosttime",
  SEPARATOR: ";",
  EXIT:"exit"
};

class Message {
  constructor(msg) {
    const data = msg.split(PROTOCOL.SEPARATOR);
    this.cmd = data[0];
    this.args = data.slice(1);
  }

  isJoinRequest() {
    return this.cmd === PROTOCOL.JOIN;
  }
  getRoomID() {
    if (this.isJoinRequest()) {
      return this.args[1];
    }
    throw Error(`Message is not JOIN ${this.cmd}: ${this.args}`);
  }

  isCreateRequest() {
    return this.cmd === PROTOCOL.CREATE;
  }
  getUser() {
    if (this.isCreateRequest() || this.isJoinRequest()) {
      return this.args[0];
    }
    throw Error(`Message is not CREATE ${this.cmd}: ${this.args}`);
  }

  isControlRequest() {
    return this.cmd === PROTOCOL.PLAY || this.cmd === PROTOCOL.PAUSE
    || this.cmd === PROTOCOL.MOVE;
  }
  isRestart(){
    return this.cmd=== PROTOCOL.RESTART;
  }
  isHostTime(){
    return this.cmd === PROTOCOL.HOSTTIME ;
  }
  isExit(){
    return this.cmd === PROTOCOL.EXIT ;
  }
}

const Sockets = function () {
  const sockets = this || {};
  sockets.setup = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws) => {
      ws.on("message", (msg) => {
        let message = new Message(msg);

        if (message.isJoinRequest()) {
          rooms.join(message.getRoomID(), message.getUser(), ws);
          ws.send(PROTOCOL.JOINED ); //FIX
        }
         else if (message.isCreateRequest()) {
          const id = rooms.create(message.getUser(), ws);
          ws.send(PROTOCOL.CREATED + PROTOCOL.SEPARATOR + id
            + PROTOCOL.SEPARATOR+message.args[0]);
        } 
        else if (message.isControlRequest()) {
          let roomID = rooms.getRoomID(ws);
          console.log("server: host dio play");
          console.log(roomID);
          rooms.getUsers(roomID).forEach((user) => {
            console.log(message.cmd);
            if (message.cmd===PROTOCOL.MOVE){
            user.socket.send(message.cmd + PROTOCOL.SEPARATOR
              + message.args[0]);}
            else{
              user.socket.send(message.cmd )
            }
          });
        }

        else if (message.isRestart()){
          console.log("entra restart")
          let roomID = rooms.getRoomID(ws);
          let host= rooms.getHost(roomID)
          host.socket.send("hosttime"+PROTOCOL.SEPARATOR +roomID)
        }

        else if (message.isHostTime()){
          let roomID =  message.args[0]
          let time= message.args[1]
          rooms.getUsers(roomID).forEach((user) => {
            user.socket.send(PROTOCOL.MOVE+PROTOCOL.SEPARATOR+time)
          })
        }
        else if (message.isExit()){
          let roomID =  message.args[0]
          console.log("exit");
          rooms.exit(roomID,ws);


        }
      });
    });
    wss.on("close", () => {
      //Do some cleanup here
    });
  };

  /* TO DO: Notify chat message
  sockets.notifyAll = (data) => {
    for (let ws of clients) {
      ws.send(data);
    }
  };
  */

  return sockets;
};

module.exports = Sockets();
