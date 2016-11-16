
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
    // without this the event is triggered twice for some reason
    event.stopPropagation();
		Meteor.call('delete', this.position);
	}
});


Template.playlist.onCreated(function() {
  this.autorun(function() {
	   this.subscribe('playlist');
  }.bind(this));
});
