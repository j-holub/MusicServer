'use strict';

const path = require('path');

const Playlist = require(path.join(__dirname, 'playlist.js'));
// dev version of Node-MPV 2
const mpvAPI = require(path.join(__dirname, '../../Node-MPV/index.js'));


const Player = class {

	constructor (cache_dir) {
		// create the MPV player
		this.mpv = new mpvAPI({
			'audio_only': true,
		});
		// Playlist
		this.playlist = new Playlist(cache_dir);

		this.mpv.on('stopped', () => {

		});
	}

	start (){
		return this.mpv.start();
	}


	append (url) {
		return this.playlist.append(url);
	}

	next() {
		this.playlist.next();
		return this.mpv.load(this.playlist.currentSong().file, 'replace');
	}

	pause() {
		return this.mpv.pause();
	}

	resume() {
		return this.mpv.resume()
	}

	play() {
		return this.mpv.load(this.playlist.currentSong().file);
	}

}

module.exports = Player;
