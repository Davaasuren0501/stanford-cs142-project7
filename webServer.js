"use strict";
var mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

var session = require("express-session");
var bodyParser = require("body-parser");
var multer = require("multer");
var fs = require("fs");

var express = require("express");
var app = express();

var async = require("async");

var cors = require("cors");
app.use(cors());

app.use(express.static(__dirname));
app.use(
  session({ secret: "secretKey", resave: false, saveUninitialized: false })
);
app.use(bodyParser.json());

// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require("./schema/user.js");
var Photo = require("./schema/photo.js");
var SchemaInfo = require("./schema/schemaInfo.js");

// XXX - Your submission should work without this line. Comment out or delete this line for tests and before submission!
var cs142models = require("./modelData/photoApp.js").cs142models;

mongoose
  .connect(
    "mongodb+srv://Ragchaa:b86x4EIUVtTWzI1h@cluster0.syiygng.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("======> mongoose connected");
  })
  .catch(() => {
    console.log("======> mongoose not connected");
  });

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.

app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get("/test/:p1", function (request, response) {
  // Express parses the ":p1" from the URL and returns it in the request.params objects.
  console.log("/test called with param1 = ", request.params.p1);

  var param = request.params.p1 || "info";

  if (param === "info") {
    // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
    SchemaInfo.find({}, function (err, info) {
      if (err) {
        // Query returned an error.  We pass it back to the browser with an Internal Service
        // Error (500) error code.
        console.error("Doing /user/info error:", err);
        response.status(500).send(JSON.stringify(err));
        return;
      }
      if (info.length === 0) {
        // Query didn't return an error but didn't find the SchemaInfo object - This
        // is also an internal error return.
        response.status(500).send("Missing SchemaInfo");
        return;
      }

      // We got the object - return it in JSON format.
      console.log("SchemaInfo", info[0]);
      response.end(JSON.stringify(info[0]));
    });
  } else if (param === "counts") {
    // In order to return the counts of all the collections we need to do an async
    // call to each collections. That is tricky to do so we use the async package
    // do the work.  We put the collections into array and use async.each to
    // do each .count() query.
    var collections = [
      { name: "user", collection: User },
      { name: "photo", collection: Photo },
      { name: "schemaInfo", collection: SchemaInfo },
    ];
    async.each(
      collections,
      function (col, done_callback) {
        col.collection.countDocuments({}, function (err, count) {
          col.count = count;
          done_callback(err);
        });
      },
      function (err) {
        if (err) {
          response.status(500).send(JSON.stringify(err));
        } else {
          var obj = {};
          for (var i = 0; i < collections.length; i++) {
            obj[collections[i].name] = collections[i].count;
          }
          response.end(JSON.stringify(obj));
        }
      }
    );
  } else {
    // If we know understand the parameter we return a (Bad Parameter) (400) status.
    response.status(400).send("Bad param " + param);
  }
});

/*
 * URL /user/list - Return all the User object.
 */
app.get("/user/list", function (request, response) {
  //response.status(200).send(cs142models.userListModel());
  User.find((error, users) => {
    if (error) response.status(501).send(error);
    response.status(200).send(users);
  });
});

/*
 * URL /user/:id - Return the information for User (id)
 */
app.get("/user/:id", function (request, response) {
  var id = request.params.id;
  console.log(id);
  let user = {};

  // Retrieve user from database
  User.findOne({ _id: id }, (error, queryUser) => {
    if (error) response.status(501).send(error);
    user = queryUser;
    console.log(user);
    if (user === null) {
      console.log("User with _id:" + id + " not found.");
      response.status(400).send("Not found");
      return;
    }
    console.log("==========");
    console.log(user);
    response.status(200).send(user);
  });

  // Send user response
});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get("/photosOfUser/:id", function (request, response) {
  var id = request.params.id;
  var photos = {};

  // Retrieve user from database
  Photo.find({ user_id: id }, (error, queryPhotos) => {
    if (error) response.status(501).send(error);
    // response.status(200).send(users);
    photos = queryPhotos;
    if (photos.length === 0) {
      console.log("Photos for user with _id:" + id + " not found.");
      response.status(400).send("Not found");
      return;
    }

    response.status(200).send(photos);
  });

  // Send photos response
});
app.post("/admin/login", function (request, response) {
  console.log("====================================");
  console.log(request.body);
  console.log("====================================");
  var loginName = request.body.login_name;
  var password = request.body.password;
  User.findOne(
    { login_name: loginName, password: password },
    function (err, info) {
      if (err) {
        console.error("Doing /admin/login error: ", err);
        response.status(400).send(JSON.stringify(err));
        return;
      }
      if (info === null || info === undefined) {
        console.log("User login name or password not found.");
        response.status(400).send("Not found");
        return;
      }
      let session_data = request.session;
      session_data.user_id = info._id;
      session_data.first_name = info.first_name;
      session_data.last_name = info.last_name;
      response.status(200).send({
        _id: info._id,
      });
    }
  );
});

app.post("/admin/logout", function (request, response) {
  if (
    request.session.user_id === null ||
    request.session.user_id === undefined
  ) {
    response.status(400).send("User is not logged in.");
  } else {
    request.session.destroy(function (err) {
      console.log(err);
    });
    response.status(200).send("Logout success.");
  }
});

app.post("/user", function (request, response) {
  console.log("====================================");
  console.log(request.body);
  console.log("====================================");
  var loginName = request.body.login_name;
  var firstName = request.body.first_name;
  var lastName = request.body.last_name;
  var location = request.body.location;
  var description = request.body.description;
  var occupation = request.body.occupation;
  var password = request.body.password;
  User.find({ login_name: loginName }, function (err, info) {
    if (err) {
      console.error("Verifying username error: ", err);
      return;
    }
    if (info.length !== 0) {
      response.status(400).send("Username already exists.");
      return;
    }
    if (
      loginName.length === 0 ||
      password.length === 0 ||
      firstName.length === 0 ||
      lastName.length === 0
    ) {
      response.status(400).send("User information not valid.");
      return;
    }
    var registeredUserObj = {
      first_name: firstName,
      last_name: lastName,
      location: location,
      description: description,
      occupation: occupation,
      login_name: loginName,
      password: password,
    };
    User.create(registeredUserObj, function (error) {
      if (error) {
        console.error("Registering user error: ", error);
        response.status(400).send(JSON.stringify(error));
        return;
      }
      response.status(200).send("User successfully registered.");
    });
  });
});

var server = app.listen(5000, function () {
  var port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
      port +
      " exporting the directory " +
      __dirname
  );
});
