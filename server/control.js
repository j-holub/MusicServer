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
        // if the player was muted, set it to the old volume
        if(player_status.mute){
            Status.update({}, {$set: {'volume': volume_before_mute}});  
            mpv_player.volume(volume_before_mute);
        }
        else{
            console.log(player_status.volume);
            // safe the old volume
            volume_before_mute = player_status.volume;
            // set the volume to 0 (for UI purposes)
            Status.update({}, {$set: {'volume': 0}});       
        }
        // just for the convience of the mpv status object
        mpv_player.mute();
    },
    // skip
    skip: function() {
        console.log("skip");
        // this will trigget the 'stopped' event which starts the next song
        mpv_player.stop();
    },
    // adjusts the volume but does NOT set in in the Status object
    // this function is called when the volume Slider is only dragged, but not released
    volume: function(vol) {
        mpv_player.volume(parseInt(vol));
        // unmute if the volume is above 0
        console.log("Volume: " + vol);
        if(vol > 0 && player_status.mute){
            mpv_player.mute();
        }
    },
    // adjusts and SETS the volume in the status object
    // causing a reactive push to every client
    setVolume: function(vol) {
        mpv_player.volume(parseInt(vol));
        // unmute if the volume is above 0
        console.log("Volume: " + vol);
        if(vol > 0 && player_status.mute){
            mpv_player.mute();
        }
        // volume is 0
        // this is similar to mute. Safe the old volume to be able to restore it
        // when clicking on the button in the UI
        else{
            volume_before_mute = Status.findOne().volume;
            // mark the player as muted
            // maybe change Node-MPV behaviour to a toggleMute, mute and umute function
            mpv_player.mute();
        }
        // update the Status object
        Status.update({}, {$set:{'volume': vol, 'currentPosition': timeposition}});
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
    getVolume: function() {
        Status.update({}, {$set: {'volume': player_status.volume}});
        return player_status.volume;
    }
});