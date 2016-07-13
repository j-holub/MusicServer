import fs  from 'fs';

Meteor.methods({
   // plays the first song in the playlist
    play: function() {
        console.log("play");
        // check if at least one song is enqueued
        if(Playlist.find().count() > 0){
            var song = Playlist.findOne({'position': 0});

            // if the song was downloaded play the local file
            if(song.file && fs.existsSync(song.file)){
                mpv_player.loadFile(song.file);
            }
            // stream the song
            else{
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
        mpv_player.volume(parseInt(vol));
        // unmute if the volume is above 0
        if(vol > 0 && player_status.mute){
            mpv_player.mute();
        }
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
    },
     // updates the Status object so the current volume is pushed to all clients
    update: function() {
        Status.update({}, {$set:{'volume': player_status.volume, 'currentPosition': timeposition}});
    },
});