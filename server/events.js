import fs  from 'fs';

// will update the current status
mpv_statuschange = function(status) {
    // update the player_status object
    player_status = status;
}




mpv_started = function() {
    // set the playing state accordingly
    Status.update({}, {$set: {'playing': true, 'currentPosition': timeposition}});
}




// when stopped the next song in the queue will be played
mpv_stopped = function() {

    // set the playing status to false
    Status.update({}, {$set: {playing: false, currentPosition: 0}});
    timeposition = 0;

    // check if there is a next song to play
    if(Playlist.find().count() > 0){

        // get the first song in the playlist
        var lastSong = Playlist.findOne({'position': 0});

        // delete  it
        // TODO maybe only delete songs if a limit of cached songs is deleted
        if(lastSong.file && fs.existsSync(lastSong.file)){
            fs.unlinkSync(lastSong.file);
        }

        // delete the Thumbail
        Thumbnails.remove(lastSong.thumbnail._id);

        // TODO maybe keep the old songs with a negative playlist position to allow going back
        Playlist.remove(lastSong);
        Playlist.update({}, {$inc: {'position': -1}}, {multi: true});


        // play the next song
        // TODO error handling
        if(Playlist.find().count() > 0){
            Meteor.call('play');
        }
    }
}



mpv_paused = function() {
    Status.update({}, {$set: {'playing': false, 'currentPosition': timeposition}});
}



mpv_resumed = function() {
    Status.update({}, {$set: {'playing': true, 'currentPosition': timeposition}});
}



mpv_timeposition = function(time){
    timeposition = parseInt(time);
    // console.log("Time: " + time);
    // somtimes the time has to be synct right now
    if(setTime){
        Status.update({}, {$set: {'currentPosition': timeposition}});
        setTime = false;
    }
}


