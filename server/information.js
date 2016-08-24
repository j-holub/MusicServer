Meteor.methods({
	getTimePos: function() {
        Status.update({}, {$set: {'currentPosition': timeposition}});
        return timeposition;
    },
    getVolume: function() {
        Status.update({}, {$set: {'volume': player_status.volume}});
        return player_status.volume;
    },
    getCurrentSong: function() {
    	return Playlist.findOne({'position': 0});
    }
});