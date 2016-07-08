import fs  from 'fs';

Meteor.methods({
   // plays the first song in the playlist
    play: function() {
        // check if at least one song is enqueued
        console.log("play");
        if(Playlist.find().count() > 0){
            var song = Playlist.findOne({'position': 0});

            console.log(song);

            // if the song was downloaded play the local file
            if(song.file && fs.existsSync(song.file)){
                console.log("loadFile");
                mpv_player.loadFile(song.file);
            }
            // stream the song
            else{
                console.log("stream");
                mpv_player.loadStream(song.url);
            }
        }
    },
    // toggles pause mode
    pause: function() {
        console.log("pause");
        // set the playing status and time correctly
        mpv_player.togglePause();
    },
    // toggles mute
    mute: function() {
        console.log("mute");
        mpv_player.mute();
    },
    // skip
    skip: function() {
        console.log("skip");
        // this will trigget the 'stopped' event which starts the next song
        mpv_player.stop();
    },
    // adjust the volume
    volume: function(vol) {
        mpv_player.volume(vol);
    },
    // seek in the title
    seek: function(sec) {
        mpv_player.seek(sec);
        // this will set the correct time on the next timeposition event
        setTime = true;
    },
    // jumps to the specified position in the title
    jumpTo: function(sec) {
        mpv_player.goToPosition(sec);
        // this will set the correct time on the next timeposition event
        setTime = true;
    },
    getTimePos: function() {
        Status.update({}, {$set: {'currentPosition': timeposition}});
        return timeposition;
    }
});