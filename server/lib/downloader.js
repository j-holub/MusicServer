'use strict';

const fs   = require('fs');
const path = require('path');

const youtube_dl = require('youtube-dl');

// Downloads songs from YouTube using youtube-dl
// It stores the files within the cache_dir specified in the config file
const Downloader = class{

	// creates the cache directory
	constructor(cache_dir) {
		// check if the cache folder already exists and create it if not
		if(!fs.existsSync(cache_dir)){
			fs.mkdirSync(cache_dir);
		}

		// save the cache dir
		this.cache_dir = cache_dir;

		// arguments for youtube dl
		this.yt_dl_args = ['--format=251/171/140/250/249/bestaudio', '--extract-audio']
	}

	// Downloads the song specified by the url
	//
	// @param {url} - the url to the source of the song
	//
	// @return {Promise}
	downloadSong(url) {
		return new Promise((resolve, reject) => {
			// download the song
			const song = youtube_dl(url, this.yt_dl_args);

			// download info
			song.on('info', (info) => {
				// strip the extension and replace it by 'mp3'
				const filename = info._filename.split('.').slice(0, -1).join('.') + '.mp3';
				// get the thumbnail
				const thumbnail = info.thumbnails[0].url;
				// duration
				const duration = info.duration;
				// title
				const title = info.title;

				// write the file
				song.pipe(fs.createWriteStream(path.join(this.cache_dir, filename)));

				// resolve the promise
				return resolve({
					'url': url,
					'file': path.join(this.cache_dir, filename),
					'title': title,
					'duration': duration,
					'thumbnail': thumbnail
				});
			});

			// check for an error if the url is not valid
			song.on('error', (error) =>{
				return reject(error);
			});
		});
	}
}

module.exports = Downloader;
