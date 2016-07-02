
Template.playlist.helpers({
   listPlaylist: function() {
       return Playlist.find({'position': {$gte: 1}}, {sort: {'position': 1}});
   },
   durationDisplay: function() {
   	var minutes  = Math.floor(this.duration / 60);
	var seconds = this.duration % 60;

	// add leading 0 for 1 digit values
	var secondString = seconds > 9 ? `${seconds}` : `0${seconds}`;

	// check if 1 hour is exceeded
	if(minutes >= 60){
		var hours = Math.floor(minutes/60);
		minutes = minutes - (hours*60);

		// add leading 0 for 1 digit value
		var minuteString = minutes > 9 ? `${minutes}` : `0${minutes}`;

		return `${hours}:${minuteString}:${secondString}`;
	}
	// 1 hour is not exceeded
	else{
		return `${minutes}:${secondString}`;
	}
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
