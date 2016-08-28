
Template.playlist.helpers({
    listPlaylist: function() {
       return Playlist.find({'position': {$gte: 1}}, {sort: {'position': 1}});
    },
    durationDisplay: function() {
    	return timeFormat(this.duration, this.duration);
   	},
    playlistDuration: function() {
      var Songs = Playlist.find({'position': {$gte: 1}});
      // the total duration
      var totalDuration = 0;
      Songs.forEach(function (song) {
        totalDuration += song.duration;
      });
      // return the formatted timestring
      return timeFormat(totalDuration, totalDuration);
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
