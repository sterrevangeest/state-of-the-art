var socket = io();

// import currentLocation from "./location.js";

// console.log(currentLocation());

var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");

form.addEventListener("submit", function(e) {
 console.log(e);
 e.preventDefault();
 if (input.value) {
  socket.emit("hey message", input.value);
  input.value = "";
 }
});

socket.on("chat message", function(msg) {
 var item = document.createElement("li");
 item.textContent = msg;
 messages.appendChild(item);
 //  window.scrollTo(0, document.body.scrollHeight);
});

socket.on("detected store", function(msg) {
 console.log("detected a store");
 var item = document.createElement("p");
 item.textContent = msg;
 messages.appendChild(item);
 //  window.scrollTo(0, document.body.scrollHeight);
});

socket.on("upload file", function(msg) {
 console.log("upload file");
 var item = document.createElement("input");
 item.type = "file";
 item.id = "file-input";
 item.textContent = "Upload or take a picture";

 messages.appendChild(item);
 //  window.scrollTo(0, document.body.scrollHeight);
});

var id, target, options;

function success(pos) {
 var crd = pos.coords;
 console.log("Changed position to:", crd);
 socket.emit("chat message", { lat: crd.latitude, lng: crd.longitude });
}

function error(err) {
 console.warn("ERROR(" + err.code + "): " + err.message);
}

target = {
 latitude: 0,
 longitude: 0
};

options = {
 enableHighAccuracy: false,
 timeout: 5000,
 maximumAge: 0
};

id = navigator.geolocation.watchPosition(success, error, options);
