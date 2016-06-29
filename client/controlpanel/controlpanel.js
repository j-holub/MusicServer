

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
			// clear the timer to prevent races
			clearInterval(intervalTimer);
			// update the client status vars
			clientTimePos = status.currentPosition;
			playingStatus  = status.playing;
			// set the time accordingly
			setTimeUI(clientTimePos);
			// reset the timer to prevent syncronisation bugs
			intervalTimer = setInterval(updateTimer, 1000);
		}
	});
});



Template.controlpanel.onRendered(function() {

	// when DOM has rendered set the correct time
	setTimeout(function() {
		Meteor.call('getTimePos', function(error, time){
			if(!error){
				// displays the time in the UI
				setTimeUI(time);
			}	
		});
	// give the DOM time to load
	// for some reason $(document).ready() does not work
	}, 200);

	// set the timer to update the client time roughly every second
	intervalTimer = setInterval(updateTimer, 1000);
});


