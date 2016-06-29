

Template.controlpanel.helpers({
	currentSong: function () {
		return Playlist.findOne({'position': 0});
	},
	playingStatus: function() {
		return Status.findOne().playing;
	}
});


Template.controlpanel.events({
	'click #playpause': function () {
		// if playing toggle pause
		Meteor.call('pause');
		
	},
	'click #skip': function() {
		Meteor.call('skip');
	}
});

Template.controlpanel.onCreated(function() {
	// this updates the states whenever they are changed on the serverside
	this.autorun(function() {
		var status = Status.findOne();
		if(status){
			clientTimePos = status.currentPosition;
			playingStatus  = status.playing;
			// reset the timer to prevent syncronisation bugs
			clearInterval(intervalTimer);
			intervalTimer = setInterval(updateTimer, 1000);
		}
	});
});

Template.controlpanel.onRendered(function() {

	var timePosString;
	var minutes;
	var seconds;

	// when DOM has rendered set the correct time
	setTimeout(function() {
		Meteor.call('getTimePos', function(error, time){
			if(!error){
				clientTimePos = time;

				var minutes = Math.floor(time/60);
				var seconds = time % 60;

				if(seconds>9){
					$('#timepos').text(`${minutes}:${seconds}`);
				}
				else{
					$('#timepos').text(`${minutes}:0${seconds}`);
				}
			}	
		});
	// give the DOM time to load
	// for some reason $(document).ready() does not work
	}, 200);

	// set the timer to update the client time roughly every second
	intervalTimer = setInterval(updateTimer, 1000);
});


