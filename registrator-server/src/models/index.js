const mongoose = require("mongoose")
mongoose.Promise = global.Promise

const db = {};
db.mongoose = mongoose;
db.url = process.env.MONGO_DB_URI
db.UserData = require("./UserData.model")(mongoose)
db.UserAccess = require("./UserAccess.model")(mongoose)

module.exports = db;