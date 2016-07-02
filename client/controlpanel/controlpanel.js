

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

		
	},
	currentPosition: function() {
		// the current position
		var time = Template.instance().clientTimePos.get();
		// whole duration of the song
		var durationMinutes = Math.floor(this.duration/60);

		var minutes  = Math.floor(time / 60);
		var seconds = time % 60;

		// add leading 0 for 1 digit values
		var secondString = seconds > 9 ? `${seconds}` : `0${seconds}`;

		// check if 1 hour is exceeded
		if(minutes >= 60 || durationMinutes >= 60){
			var hours = Math.floor(minutes/60);
			minutes = minutes - (hours*60);

			var durationHours = Math.floor(durationMinutes);

			// add leading 0 for 1 digit value
			var minuteString = minutes > 9 ? `${minutes}` : `0${minutes}`;
			var hourString   = durationHours > 9 ? `${hours}` : `0${hours}`;

			return `${hourString}:${minuteString}:${secondString}`;
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

	// define client time position as a reactive var
	this.clientTimePos = new ReactiveVar(0);

	// keeps track of wether a song is playing or not
	this.playingStatus;

	// this updates the states whenever they are changed on the serverside
	this.autorun(function() {
		var status = Status.findOne();
		if(status){
			// clear the timer to prevent races
			clearInterval(this.intervalTimer);
			// update the client status vars
			this.clientTimePos.set(status.currentPosition);
			this.playingStatus  = status.playing;
			// reset the timer to prevent syncronisation bugs
			this.intervalTimer = setInterval(this.updateTimer, 1000);
		}
	}.bind(this));

	// the interval function
	this.updateTimer = function( ){
		if(this.playingStatus){
			// increase the timer
			var current = this.clientTimePos.get();
			current += 1;
			this.clientTimePos.set(current);
		};
	}.bind(this)
	
	// the interval timer
	this.intervalTimer = setInterval(this.updateTimer, 1000);

});



Template.controlpanel.onRendered(function() {


	setTimeout(
	// get the correct time as soon as the template has rendered
	Meteor.call('getTimePos', function(error, time){
		if(!error){
			console.log(time);
			// clear the timer to prevent races
			clearInterval(this.intervalTimer);
			// set the client time
			this.clientTimePos.set(time);
			// reset the timer to prevent syncronisation bugs
			this.intervalTimer = setInterval(this.updateTimer, 1000);
		}	
	// to be able to access the clientTimePos Reactive var
	}.bind(this)), 200);
	
});


