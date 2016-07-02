
// publishes the first song in the playlist
Meteor.publish('currentSong', function() {
	return Playlist.find({'position': 0});
})

// publish the status object
Meteor.publish('status', function() {
	return Status.find();
})