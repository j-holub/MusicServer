import downloader from 'youtube-dl';
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

    // create the folder to store the cached songs
    if(!fs.existsSync('songs')){
        fs.mkdirSync('songs');
    }

    // download every song if cached mode is activated
    if(cached){
        // arguments to select the format for youtube-dl
        var args = ['--format=251/171/140/250/249/best'];

        // download each song in the playlist
        Playlist.find().forEach(function(queuedSong){
            // download the song
            var song = downloader(queuedSong.url, args);
            // write it to the HDD
            song.pipe(fs.createWriteStream(`songs/${queuedSong.title}.mp3`));

            console.log(`Handling title "${queuedSong.title}`);
        });


    }

});