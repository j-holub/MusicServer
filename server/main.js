'use strict';


const http = require('http');
const path = require('path');

const socketIO = require('socket.io');
const express = require('express');

const Cgf = require(path.join(__dirname, 'lib/config.js'));
const Downloader = require(path.join(__dirname, 'lib/downloader.js'));
const Playlist = require(path.join(__dirname, 'lib/playlist.js'));




// read the config
const config = new Cgf(path.join(__dirname, '../config.json'));
// playlist
const playlist = new Playlist(path.join(__dirname, `../${config.cache_dir}`));


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
server.listen(config.port);
// io
const io = socketIO(server);

io.on('connection', ()=> {
	console.log('connected');
});
