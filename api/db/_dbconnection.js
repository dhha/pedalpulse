const mongoClient = require("mongodb").MongoClient;

let _connection = null;

const open = function() {
    if(get() == null) {
        mongoClient.connect(process.env.DB_CONNECTION_URL, function(err, client) {
            if(err) {
                console.log("Connect fail", err);
                return;
            } else if(client) {
                _connection = client.db(process.env.DB_NAME)
                console.log("Connected to mongodb");
            }
        });
    }
}

const get = function() {
    return _connection;
}

module.exports = {
    get,
    open
}