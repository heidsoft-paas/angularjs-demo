
/**
 * Module dependencies.
 */

var express = require("express");
require("express-namespace"); // After this statement, app.namespace() will automatically be available
var http = require("http");
var path = require("path");
var app = express();
var fs = require('fs'); 

// Configure environments
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.use(express.favicon("public/images/favicon.ico"));
app.engine('html', function (filename, options, callback) {
  fs.readFile(filename, { encoding: "utf8" }, function(err, html) {
    if(err) return callback(err);
    callback(null, html);
  }); 
});
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, "public"), { maxAge: 0 /* no cache */ }));

// Define routes
app.get("/", function(req, res) {
  res.contentType("text/html");
  res.render("main.html");
});
app.namespace("/api", function() {
  app.post("/", function(req, res) {
    res.send("GET forum " + req.params.id);
  });
});

// Listen port
var listeningPort = app.get("port");
http.createServer(app).listen(listeningPort, function() {
  console.log("Express server listening on port %d", listeningPort);
});
