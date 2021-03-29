// module "location.js"
var socket = io();

export default function currentLocation() {
 function getLocation() {
  if (navigator.geolocation) {
   navigator.geolocation.getCurrentPosition(updatePosition);
  }
  return null;
 }

 function updatePosition(position) {
  const lat = window.lat;
  const lng = window.lng;
  if (position) {
   if (lat !== position.coords.latitude && lng !== position.coords.longitude && lat !== false && lng !== false) {
    console.log("Moved");
    window.lat = position.coords.latitude;
    window.lng = position.coords.longitude;
    socket.emit("chat message", { lat: window.lat, lng: window.lng });
   }
  }
 }

 setInterval(function() {
  updatePosition(getLocation());
 }, 1000);
}
