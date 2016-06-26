
Template.controlpanel.helpers({
	currentSong: function () {
		return Playlist.findOne({'position': 0});
	}
});


Template.controlpanel.events({
	'click #playpause': function () {
		Meteor.call('pause');
	},
	'click #skip': function() {
		Meteor.call('skip');
	}
});