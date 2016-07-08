
Template.playlist.helpers({
    listPlaylist: function() {
       return Playlist.find({'position': {$gte: 1}}, {sort: {'position': 1}});
    },
    durationDisplay: function() {
    	return timeFormat(this.duration, this.duration);
   	}
});

Template.playlist.events({
	'click .delete': function (event) {
		Meteor.call('delete', this.position);
	}
});


Template.playlist.onCreated(function() {
	Meteor.subscribe('playlist');
});
