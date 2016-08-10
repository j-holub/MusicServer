
// publishes the first song in the playlist
Meteor.publish('currentSong', function() {
	// TODO find a way to make it work, when only publishing the Thumbail for the current song
	return [Playlist.find({'position': 0}), Thumbnails.find()];
});

// publish the status object
Meteor.publish('status', function() {
	return Status.find();
});