const express = require("express");

const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const sharedsession = require("express-socket.io-session");
const session = require("express-session")({
 secret: "my-secret",
 resave: true,
 saveUninitialized: true
});

const routes = require("./routes.js").routes(app);

app.set("view engine", "ejs");
app.use(express.static("static"));
app.use(bodyParser.urlencoded({ extended: true }));

// Attach session
app.use(session);

// Share session with io sockets
io.use(
 sharedsession(session, {
  autoSave: true
 })
);

const supermarkets = [
 {
  name: "Albert Heijn",
  location: { lat: 52.4966, lng: 52.1958 }
 }
];

function startsWith(supermarket, user, status) {
 const userStr = user.substr(0, 6);
 const supermarketStr = supermarket.substr(0, 6);

 if (userStr === supermarketStr) {
  status = true;
  return status;
 } else {
  status = false;
  return status;
 }
}

let status;

io.on("connection", socket => {
 setTimeout(() => {
  io.emit("chat message", "Hi, welcome!");
 }, 1000);

 socket.on("chat message", userLocation => {
  supermarkets.map(supermarket => {
   let supermarketLocation = userLocation.lat - 1;

   setTimeout(() => {
    supermarketLocation += 1;
    const supermarketLat = String(supermarketLocation);
    const userLat = String(userLocation.lat);
    const oldStatus = status;
    status = startsWith(supermarketLat, userLat, status);
    var timestamp = new Date().toLocaleTimeString();

    if (oldStatus != status) {
     io.emit("detected store", timestamp + " Started shopping at " + supermarket.name);
     setTimeout(() => {
      io.emit("chat message", "Hey, please do not forget to upload your receipt!");
      io.emit("upload file", "UPLOAD FILE");
     }, 10000);
    }
   }, 10000);
  });
 });
});

http.listen(port, () => console.log(`Example app listening on port ${port}!`));
