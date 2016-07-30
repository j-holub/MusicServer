import downloader from 'youtube-dl';
import mpv from 'node-mpv';
import fs  from 'fs';
import sanitize from 'sanitize-filename'
import fsw from 'file-size-watcher';

// global variable to access mpv
mpv_player = null;

// state weather songs should be cached or not
cached = true;

// saves the mpv status properties
player_status = {};

// saves the current time position of the playing song
timeposition = 0;
setTime = false;

// to save the volume value when muted
volume_before_mute = 0;


Meteor.startup(function() {

    // start mpv player in audio only mode
    mpv_player = new mpv({
        audio_only: true,
        time_update: 0.5
    });



    // set up the events
    mpv_player.on('started', Meteor.bindEnvironment(mpv_started));
    mpv_player.on('stopped', Meteor.bindEnvironment(mpv_stopped));
    mpv_player.on('paused', Meteor.bindEnvironment(mpv_paused));
    mpv_player.on('resumed', Meteor.bindEnvironment(mpv_resumed));
    mpv_player.on('statuschange', Meteor.bindEnvironment(mpv_statuschange));
    mpv_player.on('timeposition', Meteor.bindEnvironment(mpv_timeposition));


    // create the folder to store the cached songs
    if(!fs.existsSync('songs')){
        fs.mkdirSync('songs');
    }


    // create the status database object, if not already created
    if(Status.find().count() == 0){
        Status.insert({
            currentPosition: 0,
            playing: false,
            volume: 50
        });
    }
    else{
        Status.update({}, {$set: {currentPosition: 0, playing: false}});
    }


    // set the volume
    mpv_player.volume(Status.findOne().volume);
    volume_before_mute = Status.findOne().volume;


    // download every song if cached mode is activated
    if (cached) {
        // arguments to select the format for youtube-dl
        var args = ['--format=251/171/140/250/249/bestaudio'];

        // download each song in the playlist
        Playlist.find().forEach(function (queuedSong) {
            // download the song
            var song = downloader(queuedSong.url, args);

            var filename = `${sanitize(queuedSong.title, " ")}.mp3`;

            // write it to the HDD
            song.pipe(fs.createWriteStream(`songs/${filename}`));

            console.log(`Handling title "${queuedSong.title}"`);
        });
    }


    // syncs the client time with the real time roughly every 20 seconds
    setInterval(Meteor.bindEnvironment(function(){
        Status.update({}, {$set: {'currentPosition': timeposition}});
    }), 20000);


    // if there are songs in the queue, play them
    if(Playlist.find().count() > 0){
        if(cached){

            var file = Playlist.find({'position': 0}).file;

            // in the rare case, that the server mode was switched to cached, but the remaining
            // playlist entries are uncached, there won't be any filestring
            if(file){
                // check for the filesize
                if(fs.statSync(file)["size"] > 200000){
                    Meteor.call('play');
                }
                else{
                    // check for the filesize because when 'play' is called the early, the filesize is so small
                    // playback stops immediatly
                    var fileWatcher = fsw.watch(file).on('sizeChange', Meteor.bindEnvironment(function (newSize, oldSize){
                        // when the file is bigger than 200kB play it
                        if(newSize > 200000){
                            Meteor.call('play');
                            // release the file watcher
                            fileWatcher.stop();
                        }
                    }));   
                }
            }
            // when there is no file just let the 'play' method handle the playback
            else{
                Meteor.call('play');
            }
                             
          }
      // uncached case is just streaming anyway
      else{
        Meteor.call('play');
      }
    }

});