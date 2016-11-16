Template.topbar.helpers({
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

Template.topbar.events({
	'click #OptionsButton': function (event) {
		$('#OptionsModal').addClass('active');
	}
});

Template.topbar.onCreated(function() {
	// subscribe to the playlist
	this.autorun(function() {
		this.subscribe('playlist');
	}.bind(this));
});
