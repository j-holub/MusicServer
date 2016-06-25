import fs  from 'fs';

// will update the current status
mpv_statuschange = function(status) {
    player_status = status;
}

// when stopped the next song in the queue will be played
mpv_stopped = function(){

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
        Meteor.call('play');

    }
}