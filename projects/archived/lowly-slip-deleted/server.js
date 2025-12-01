// server.js
// where your node app starts

// init
// setup express for handling http requests
var express = require("express");
var app = express();
app.use(express.static('public')); // http://expressjs.com/en/starter/static-files.html
app.listen(3000);
console.log('Listening on port 3000');