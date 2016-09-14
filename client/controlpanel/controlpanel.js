import noUiSlider from'nouislider';

Template.controlpanel.helpers({
	currentSong: function () {
		return Playlist.findOne({'position': 0});
	},
	playingStatus: function() {
		return Status.findOne().playing;
	},
	// is always called in the context of a playlist entry
	durationDisplay: function() {
		// return the formatted time string
		return timeFormat(this.duration, this.duration);
	},
	currentPosition: function() {
		// the current position
		var time = Template.instance().clientTimePos.get();
		// whole duration of the song
		var duration = this.duration;

		// return the formatted time string
		return timeFormat(time, duration);
	},
	getThumbnail: function() {
		var currentSong = Playlist.findOne({'position': 0});
		if(Template.instance().subscriptionsReady()){
			var thumbnail = this.thumbnail.getFileRecord();
			// console.log(thumbnail.url());
			return thumbnail.url({'store': 'Thumbnail'});
		}
	},
	// returns the appriate icon class for the play/pause button
	playPauseIcon: function() {
		var status = Status.findOne();
		if(status.playing){
			return "mdi-pause-circle-outline";
		}
		else{
			return "mdi-play-circle-outline";
		}
	},
	// returns the appriate class to display the volume icon
	volumeIcon: function () {
		var status = Status.findOne();
		if(status){
			if(status.volume == 0){
				return "mdi-volume-off";
			}
			else if (status.volume < 33){
				return "mdi-volume-low"
			}
			else if(status.volume < 66){
				return "mdi-volume-medium"
			}
			else{
				return "mdi-volume-high"
			}
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
	},
	// opens the Volume Modal
	'click #volumeButton': function() {
		$('#VolumeModal').addClass('active');
	}
});



Template.controlpanel.onCreated(function() {

	// subscribe to the publications
	this.autorun(function() {
		this.subscribe('currentSong');
		this.subscribe('status');
	}.bind(this));

	// define client time position as a reactive var
	this.clientTimePos = new ReactiveVar(0);

	// keeps track of wether a song is playing or not
	this.playingStatus;

	// keeps track of whether the slider is moved at the moment
	this.sliding = false;

	// this will update the time position server side
	// resulting in a hotpush to every client
	Meteor.call('getTimePos');

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

	
	// This sets the blurred background image in the controlpanel
	this.autorun(function() {
		if(this.subscriptionsReady()){
			var currentSong = Playlist.findOne({'position': 0});
			if(currentSong ){
				var thumbnail = currentSong.thumbnail.getFileRecord();
				$('#controlpanel').css('background', `url(${thumbnail.url({'store': 'ThumbnailBlurred'})})`);
				// When there is no song in the queue and the first one is enqueued
				// the getTemplate helper does not work for some reason
				if((Playlist.find().count() == 1)){
					$('#thumbnail').attr('src', thumbnail.url());
				}
			}
			// Remove the Background when no song is playing
			else{
				$('#controlpanel').css('background', 'none');
			}
		}
	}.bind(this));


	// sets the tab title to the current song title
	this.autorun(function() {
		if(this.subscriptionsReady()){
			var currentSong = Playlist.findOne({'position': 0});
			if(currentSong){
				$(document).prop('title', `${currentSong.title} | MusicServer`);
			}
			else{
				$(document).prop('title', 'MusicServer');	
			}
		}
	}.bind(this));


	// the interval function
	// this function updates the client time position roughly every second
	this.updateTimer = function( ){
		if(this.playingStatus){
			// update the slider position if the user isn't dragging it at the moment
			if(this.slider && !this.sliding){
				// increase the timer
				this.clientTimePos.set(this.clientTimePos.get() + 1);
				this.slider.noUiSlider.set(this.clientTimePos.get());
			}
		};
	}.bind(this)
	
	// the interval timer updates the time roughly every second
	this.intervalTimer = setInterval(this.updateTimer, 1000);

	// the UI slider
	this.slider;	

});