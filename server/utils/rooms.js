const uuid = require("uuid");


//Se entiende muy bien el codigo. 
const Rooms = function () {
  const Rooms = {};
  const rooms = new Map();
  let users = new Map();

  Rooms.join = (roomID, user, ws) => {
    users.set(ws, roomID);
    rooms.get(roomID).users.push({ user: user, socket: ws });
  };

  Rooms.create = (user, ws) => {
    let id = uuid.v4();
    let host = { user: user, socket: ws };
    rooms.set(id, { host: host, users: [] });
    users.set(ws, id);
    return id;
  };

  Rooms.getUsers = (roomID) => {
    console.log(rooms.get(roomID)+ "getusers");
    return rooms.get(roomID).users;
  };

  Rooms.getRoomID = (ws) => {
    return users.get(ws);
  };

  
  Rooms.getHost= (roomID) => {
    console.log(rooms.get(roomID)+"gethost");
    return rooms.get(roomID).host;
  };

  return Rooms;
};

module.exports = Rooms();
