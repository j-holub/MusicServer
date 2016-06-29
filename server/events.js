import fs  from 'fs';

// will update the current status
mpv_statuschange = function(status) {

    // if the pause status has change update it in the status object
    if(player_status.pause != status.pause){
        // update playing status and current timeposition
        Status.update({}, {$set: {'playing': !status.pause, 'currentPosition': timeposition}});
    }

    // if the titlename changes a new song was started, reset the time
    if(player_status['media-title'] != status['media-title']){
        Status.update({}, {$set: {'currentPosition': timeposition}});
    }

    // this really copies the object instead of passing a reference
    player_status = Object.assign({}, status);
}

// when stopped the next song in the queue will be played
mpv_stopped = function(){

    // set the playing status to false
    Status.update({}, {$set: {playing: false, currentPosition: 0}});
    timeposition = 0;

    // check if there is a next song to play
    if(Playlist.find().count() > 0){

        // get the first song in the playlist
        var lastSong = Playlist.findOne({'position': 0});

        // delete  it
        // TODO maybe only delete songs if a limit of cached songs is deleted
        if(lastSong.file){
            fs.unlinkSync(lastSong.file);
        }
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

mpv_timeposition = function(time){
    timeposition = parseInt(time);
    console.log("Time: " + time);
    // somtimes the time has to be synct right now
    if(setTime){
        Status.update({}, {$set: {'currentPosition': timeposition}});
        setTime = false;
    }
}


