const MongoClient = require("mongodb").MongoClient;

function DB() {
  const db = {},
    dbName = "amasync",
    uri = process.env.MONGO_URL;

  db.connect = () =>
    new MongoClient(uri, { useUnifiedTopology: true }).connect();

  db.findAll = (colName, query) => {
    console.log("Finding all " + query);
    return db.connect().then((client) =>
      client
        .db(dbName)
        .collection(colName)
        .find(query)
        .sort({ timestamp: -1 })
        .toArray()
        .catch((err) => {
          client.close();
          throw err;
        })
        .then((res) => {
          client.close();
          return res;
        })
    );
  };

  db.findOne = (colName, query) => {
    console.log("Finding one " + query);
    return db.connect().then((client) =>
      client
        .db(dbName)
        .collection(colName)
        .findOne(query)
        .catch((err) => {
          client.close();
          throw err;
        })
        .then((res) => {
          client.close();
          return res;
        })
    );
  };

  db.createOne = (colName, record) => {
    console.log("Creating " + record);
    return db.connect().then((client) =>
      client
        .db(dbName)
        .collection(colName)
        .insertOne(record)
        .catch((err) => {
          client.close();
          throw err;
        })
        .then((res) => {
          client.close();
          return res;
        })
    );
  };

  db.updateOne = (colName, query, update) => {
    console.log("Updating one " + query);
    db.connect().then((client) =>
      client
        .db(dbName)
        .collection(colName)
        .updateOne(query, update)
        .catch((err) => {
          client.close();
          throw err;
        })
        .then((res) => {
          client.close();
          return res;
        })
    );
  };

  db.deleteOne = (colName, query) => {
    console.log("Deleting one " + query);
    return db.connect().then((client) =>
      client
        .db(dbName)
        .collection(colName)
        .deleteOne(query)
        .catch((err) => {
          client.close();
          throw err;
        })
        .then((res) => {
          client.close();
          return res;
        })
    );
  };

  return db;
}

module.exports = DB();
