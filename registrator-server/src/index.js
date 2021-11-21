/**
 * Required External Modules
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { clientOrigins, serverPort } = require("./config/env.dev");

const { messagesRouter } = require("./messages/messages.router");
//const {MongoClient} = require('mongodb');

/**
 * App Variables
 */

const app = express();
const apiRouter = express.Router();
var path = require('path');
global.appRoot = path.resolve(__dirname);
/**
 *  App Configuration
 */

app.use(helmet());
app.use(cors({ origin: clientOrigins }));
app.use(express.json());

app.use("/api", apiRouter);

apiRouter.use("/messages", messagesRouter);

app.use(function (err, req, res, next) {
  //console.log(err);
  const data={
    error: "api_start_failure",
    data:[err.message]//`Cannot find UserData with id=¤.`
  }
  res.status(500).send(data);
});

/**
 * Server Activation
 */

app.listen(serverPort, () =>{
    console.log(`API Server listening on port ${serverPort}`)
    main().catch(console.error)
  }
);

async function main(){
  await initDb()
}

// async function listDatabases(client){
//   databasesList = await client.db().admin().listDatabases();
//   console.log("Databases:");
//   databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// };

async function initDb(){
  const db = require("./models");
  db.mongoose
    .connect(db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //useFindAndModify: false,
      //useCreateIndex: true
    })
    .then(() => {
      console.log("Connected to the database!");
    })
    .catch(err => {
      console.log("Cannot connect to the database!", err);
      process.exit();
    });

}

