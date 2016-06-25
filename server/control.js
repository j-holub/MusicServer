import fs  from 'fs';

Meteor.methods({
   // plays the first song in the playlist
    play: function() {
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
        mpv_player.togglePause();
    },
    // toggles mute
    mute: function() {
        mpv_player.mute();
    },
    // skip
    skip: function() {
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
    },
    // jumps to the specified position in the title
    jumpTo: function(sec) {
        mpv_player.goToPosition(sec);
    }
});