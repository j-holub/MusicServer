import mpv from 'node-mpv';
import fs  from 'fs';

// global variable to access mpv
mpv_player = null;

// state wether songs should be cached or not
cached = true;

Meteor.startup(function() {

    // start mpv player in audio only mode
    mpv_player = new mpv({
        audio_only: true
    });

    // initialize youtube-dl
   // youtube_dl = Meteor.require('youtube-dl');

    // create the folder to store the cached songs
    if(!fs.existsSync('songs')){
        fs.mkdirSync('songs');
    }

});