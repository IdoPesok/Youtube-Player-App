const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


io.on('connection', function(socket) {
	console.log("A user connected")

	socket.on('playerEvent', function(event) {
		io.emit('playerEvent', event)
	})

	socket.on("videoEvent", function(event) {
		io.emit("videoEvent", event)
	})
})


app.get("/", function(req, res) {
	res.render("index")
})


http.listen(3000, function() {
	console.log("Server is up and running...")
})