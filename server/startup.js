import downloader from 'youtube-dl';
import mpv from 'node-mpv';
import fs  from 'fs';
import sanitize from 'sanitize-filename'


// global variable to access mpv
mpv_player = null;

// state weather songs should be cached or not
cached = true;

// saves the mpv status properties
player_status = {};

Meteor.startup(function() {

    // start mpv player in audio only mode
    mpv_player = new mpv({
        audio_only: true
    });

    // set up the events
    mpv_player.on('stopped', Meteor.bindEnvironment(mpv_stopped));
    mpv_player.on('statuschange', mpv_statuschange);

    // create the folder to store the cached songs
    if(!fs.existsSync('songs')){
        fs.mkdirSync('songs');
    }


    // download every song if cached mode is activated
    if (cached) {
        // arguments to select the format for youtube-dl
        var args = ['--format=251/171/140/250/249/bestaudio'];

        // download each song in the playlist
        Playlist.find().forEach(function (queuedSong) {
            // download the song
            var song = downloader(queuedSong.url, args);

            // write it to the HDD
            song.pipe(fs.createWriteStream(`songs/${sanitize(queuedSong.title, " ")}.mp3`));

            console.log(`Handling title "${queuedSong.title}"`);
        });
    }



});