const PORT = process.env.PORT || 8000; // 3001 for react
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const credentials = fs.readFileSync("./cert.pem");
const url =
  "mongodb+srv://cluster0.obfdv.mongodb.net/projectsDB?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority";
// IMPORT SCHEMAS
const myModels = require("./models/schema.js");
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

function randomNumber() {
  var numb = 0;
  var run = true;
  while (run) {
    numb = Math.floor(Math.random() * 55) + 65;
    if (numb > 90 && numb < 97) {
      continue;
    } else {
      run = false;
      return numb;
    }
  }
}

app.post("/new-url", async function (req, res) {
  res.setHeader("Content-Type", "application/json");
  console.log("body", req.body);
  console.log("Requested URL", req.body.url);

  // ASCII 97-122 lowercase
  // ASCII 65-90 uppercase
  // 50 possible characters, assume we use 4 digits
  // 50^4 permutations

  function randChars() {
    var myArray = [];
    for (let index = 0; index < 4; index++) {
      myArray.push(randomNumber());
      console.log(myArray);
    }
    return String.fromCharCode(...myArray);
  }

  var newURL = randChars();
  var newData = new myModels.URL({
    originalURL: req.body.url,
    codeURL: newURL,
  });

  function createDoc() {
    myModels.URL.create(newData)
      .then((response) => {
        if (response.creationDate !== null) {
          // create() returns a promsie with the mongodb data if successful. Success if creationDate is not null.
          // console.log("res.ok line", response);
          return res.send({
            status: "success",
            msg: `post created ${newURL}`,
            code: newURL,
          });
        } else {
          throw new Error(response); // mongoDB error
        }
      })
      .catch((e) => {
        console.error("Error:", e, "error code", e.code);
        if (e.code === 11000) {
          // 11000 is duplicate URL code...
          newData.codeURL = randChars();
          createDoc(); 
        } else {
          res.send({ status: "error", msg: `Unable to generate data ${e}` });
        }
      });
  }
  createDoc();

  console.log("new url: ", newURL);
});

app.get("/u/:code", function (req, res) {
  // res.setHeader("Content-Type", "application/json");

  console.log("Params: ", req.params.code);
  async function getData() {
    // try {
    //   let response = await db
    //     .collection("URL")
    //     .findOne({ codeURL: req.params.code })
    //     .catch( (error) =>
    //       res.send({status: "error", msg: error})
    //     );
    //   console.log("Returned document: " + response);
    //   res.send(response); // send response here should be a then.
    // } catch (error) {
    //   console.error(error);
    //   res.send({ status: "error", msg: `unable to find on mongodb` });
    // }

    let response = await db
      .collection("URL")
      .findOne({ codeURL: req.params.code })
      .then((res) => console.log("Res from mongo:", res)) // literally null since it doesnt exist yet. Check for if null then redirect to 404
      .catch((error) => console.error(error));
    console.log("Returned document: " + response);
    // res.send(response); // send response here should be a then.
    res.send({ status: "okay", msg: `hey` });
  }

  try {
    getData();
  } catch (error) {
    console.err(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
