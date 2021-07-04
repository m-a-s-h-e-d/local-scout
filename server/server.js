const PORT = process.env.PORT || 8000; // 3001 for react
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const credentials = fs.readFileSync("./cert.pem");
const url =
  "mongodb+srv://cluster0.8djg3.mongodb.net/local-scout?authSource=%24external&authMechanism=MONGODB-X509";
// IMPORT SCHEMAS
// const myModels = require("./models/schema.js");
const path = require("path");
const { createHash } = require("crypto");

// Fix for deprecation warning 'collection.ensureIndex'
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

// bodyParser.urlencoded is deprecated as its included in express
// Instead uses 'express.urlencoded and .json'
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// mongoose.connect comes first
async function connectToDB() {
  try {
    await mongoose.connect(url, {
      sslKey: credentials,
      sslCert: credentials,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error(err);
  }
}
connectToDB();

const db = mongoose.connection;
// line code 22-25 retrieved from https://www.mongoosejs.com/docs/

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("mongoose running");
});


app.get('/get-data', async function (req, res) {
    let response = await db 
    .collection('food-vendors')
    .find()
    .toArray()
    .then((data) => {
        console.log("Res from mongo success:")
        res.send({status: "success", data: data})
    })
    .catch((err) => {
        console.error(err)
        res.send({status: "error", error: err})
    })

})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
  