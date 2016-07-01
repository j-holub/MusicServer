

Template.controlpanel.helpers({
	currentSong: function () {
		return Playlist.findOne({'position': 0});
	},
	playingStatus: function() {
		return Status.findOne().playing;
	},
	// is always called in the context of a playlist entry
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
				// clear the timer to prevent races
				clearInterval(intervalTimer);
				// set the client time
				clientTimePos = time;
				// displays the time in the UI
				setTimeUI(time);
				// reset the timer to prevent syncronisation bugs
				intervalTimer = setInterval(updateTimer, 1000);
			}	
		});
	// give the DOM time to load
	// for some reason $(document).ready() does not work
	}, 200);

	// set the timer to update the client time roughly every second
	intervalTimer = setInterval(updateTimer, 1000);

});


