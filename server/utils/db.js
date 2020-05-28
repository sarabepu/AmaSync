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
        .finally(() => client.close())
    );
  };

  db.findOne = (colName, query) => {
    console.log("Finding one " + query);
    return db.connect().then((client) =>
      client
        .db(dbName)
        .collection(colName)
        .findOne(query)
        .finally(() => client.close())
    );
  };

  db.createOne = (colName, record) => {
    console.log("Creating " + record);
    return db.connect().then((client) =>
      client
        .db(dbName)
        .collection(colName)
        .insertOne(record)
        .finally(() => client.close())
    );
  };

  db.updateOne = (colName, query, update) => {
    console.log("Updating one " + query);
    db.connect().then((client) =>
      client
        .db(dbName)
        .collection(colName)
        .updateOne(query, update)
        .finally(() => client.close())
    );
  };

  db.deleteOne = (colName, query) => {
    console.log("Deleting one " + query);
    return db.connect().then((client) =>
      client
        .db(dbName)
        .collection(colName)
        .deleteOne(query)
        .finally(() => client.close())
    );
  };

  return db;
}

module.exports = DB();
