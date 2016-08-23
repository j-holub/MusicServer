import noUiSlider from'nouislider';

Template.volume.helpers({
	displayVolumeIcon: function () {
		var status = Status.findOne();
		if(status){
			if(status.volume == 0){
				return "<i class='mdi mdi-volume-off'></i>"
			}
			else if (status.volume < 33){
				return "<i class='mdi mdi-volume-low'></i>"
			}
			else if(status.volume < 66){
				return "<i class='mdi mdi-volume-medium'></i>"
			}
			else{
				return "<i class='mdi mdi-volume-high'></i>"
			}
		}
	}
});

Template.volume.events({
	'click #VolumeModal': function(event) {
		if(!(event.target != $('#VolumeModal')[0])){
			$('#VolumeModal').removeClass('active');
		}
	},
});



Template.volume.onCreated(function() {

	// subscribe to the Status object
	this.autorun(function(){
		// subscribes this Template to the Status object
		this.subscribe('status');
	}.bind(this));

	// The keyevent to close the VolumeModal with Escape
	$(document).on('keyup', function(event) {
		// Esc key
		if(event.keyCode == 27){
			$('#VolumeModal').removeClass('active');
		}
	});

	// whenever the volume changes on the server, this autorun
	// will display it on the client
	this.autorun(function(){
		// subscribes this Template to the Status object
		if(this.subscriptionsReady()){
			var status = Status.findOne();
			if(status){
				// set the volumeSlider only if the Template is initialized
				if(this.initialized){
					this.volumeSlider.noUiSlider.set(status.volume);
				}
			}
		}
	}.bind(this));

});



Template.volume.onDestroyed(function() {
	// release the event listener
	$(document).off('keyup');
});



// Initializes the NoUISlider for the Volume
Template.volume.onRendered(function() {

	// the volume slider object
	this.volumeSlider;

	// get the volume from the server
	Meteor.call('getVolume', function(error, volume){
		
		// small Timeout because onRendered() is not sufficient enough
		setTimeout(function() {
			// set the slider to the respective div element
			this.volumeSlider = $('#volumeSlider')[0];

			console.log($(this.volumeSlider));
			// create the slider
			noUiSlider.create(this.volumeSlider, {
				animate: false,
				start: volume,
				range: {
					'min': 0,
					'max': 100
				}
			});

			// when slider is dragged
			this.volumeSlider.noUiSlider.on('update', _.throttle(function() {
				var newVolume = this.volumeSlider.noUiSlider.get();
				Meteor.call('volume', parseInt(newVolume));
			}.bind(this), 50).bind(this));

			// when the slider is clicked or the drag ends
			this.volumeSlider.noUiSlider.on('change', function() {
				var newVolume = this.volumeSlider.noUiSlider.get();
				// hard set the volume to cause a reactive push to every client
				Meteor.call('setVolume', parseInt(newVolume));
			}.bind(this));


			// mark this Template as initialized
			this.initialized = true;

		}.bind(this), 100);

	}.bind(this));
	
});