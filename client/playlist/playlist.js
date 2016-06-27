
Template.playlist.helpers({
   listPlaylist: function() {
       return Playlist.find({'position': {$gte: 1}}, {sort: {'position': 1}});
   }
});

Template.playlist.events({
	'click .delete': function (event) {
		Meteor.call('delete', this.position);
	}
});
