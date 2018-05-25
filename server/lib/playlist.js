'use strict';

const fs   = require('fs');
const path = require('path');

const Downloader = require(path.join(__dirname, 'downloader.js'));

// This class manages the playlist
// It downloads and appends songs, tracks the current position, removes songs
// It provides all the information about the playlist
const Playlist = class{

	constructor(cache_dir) {
		console.log(cache_dir);
		// the plastlist
		this.list = [];
		// downloader
		this.downloader = new Downloader(cache_dir);
		// playlist position
		this.playlistpos = 0;
	}

	// Downloads and appends a song to the playlist
	//
	// @param {url} - the songs source url
	//
	// return {boolean} - if it worked or not
	async append(url) {
		try{
			const song = await this.downloader.downloadSong(url);
			this.list.push(song);
			return true;
		}
		catch(error){
			return false;
		}
	}

	// Removes the song at position pos (0 based)
	//
	// @param {pos} - 0 based position of the song in the playlist
	//
	// @return {Promise, boolean} - a promise that resolves to if the song was remove or not
	async remove(pos) {
		return new Promise((resolve, reject) => {
			if(pos >= this.list.length){
				return resolve(false);
			}
			else{
				// save the information about the deleted song
				const deletedSong = this.list[pos];
				// remove the song
				// list until the song + list after the song
				this.list = this.list.slice(0, pos).concat(this.list.slice(pos+1));
				// remove the file
				fs.unlink(deletedSong.file, (err) => {
					if(err){
						// reject on error
						return reject(err);
					}
					else{
						// resolve with true on success
						return resolve(true);
					}
				})
			}
		});
	}

	// Removes the song at position pos (1 based)
	//
	// @param {pos} - 1 based position of the song in the playlist
	//
	// @return {Promise, boolean} - a promise that resolves to if the song was remove or not
	async remove1(pos) {
		return this.remove(pos-1);
	}

	// Gets the playlist
	//
	// @return {list} - playlist
	getPlaylist() {
		return this.list;
	}

	// Gets the playlist size
	//
	// @return {Integer} - playlist size
	playlistSize() {
		return this.list.length;
	}

	// Current playlist position (0 based)
	//
	// @return {Integer} - current playlist position
	playlistPosition() {
		return this.playlistpos;
	}

	// Current playlist position (1 based)
	//
	// @return {Integer} - current playlist position
	playlistPosition1() {
		return this.playlistpos+1;
	}

	// Gets the current song
	//
	// @return {JSON} - current song
	currentSong() {
		return this.list[position];
	}

	// Gets the song at position pos (0 based)
	//
	// @return - song at position pos or null if the position does not exist
	songAtPosition(pos) {
		if(pos >= this.list.length){
			return null;
		}
		else{
			return this.list[pos];
		}
	}

	// Gets the song at position pos (1 based)
	//
	// @return - song at position pos or null if the position does not exist
	songAtPosition1(pos) {
		return songAtPosition(pos-1);
	}

}

module.exports = Playlist;
