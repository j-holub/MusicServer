'use strict';

const path = require('path');

const io = require('socket.io');
const express = require('express');


// Express JS Web App
const app = express();

// Get request for the main page
app.get('/', (req, res) => {
	// serve the main.html file of the client
	res.sendFile(path.join(__dirname, '../client/main.html'));
});

app.listen(8080);
