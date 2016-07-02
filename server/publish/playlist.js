
// publishes the whole playlist
Meteor.publish('playlist', function() {
	return Playlist.find();
});