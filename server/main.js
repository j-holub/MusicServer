'use strict';

const http = require('http');
const path = require('path');

const socketIO = require('socket.io');
const express = require('express');


// Express JS Web App
const app = express();

// Get request for the main page
app.get('/', (req, res) => {
	// serve the main.html file of the client
	res.sendFile(path.join(__dirname, '../client/main.html'));
});

// Socket IO
// create the server
const server = http.Server(app);
server.listen(8080);
// io
const io = socketIO(server);

io.on('connection', ()=> {
	console.log('connected');
});
