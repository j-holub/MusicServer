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
	'keypress': function(event) {
		if(event.charCode == 13){
			alert("foo");
		}
	}
});



Template.volume.onCreated(function() {

	// the volume slider object
	this.volumeSlider;

	// whenever the volume changes on the server, this autorun
	// will display it on the client
	this.autorun(function(){
		var status = Status.findOne();
		if(status){
			// set the volumeSlider
			if(this.volumeSlider && status.volume){
				this.volumeSlider.noUiSlider.set(status.volume);
			}
		}
	});

	// The keyevent to close the VolumeModal with Escape
	$(document).on('keyup', function(event) {
		// Esc key
		if(event.keyCode == 27){
			$('#VolumeModal').removeClass('active');
		}
	});

});



Template.volume.onDestroyed(function() {
	// release the event listener
	$(document).off('keyup');
});



Template.volume.onRendered(function() {
	this.subscribe('status');
	// handle the volume slider
	this.autorun(function() {
		this.subscribe('currentSong');

		if(this.subscriptionsReady()){

			var volume = Status.findOne().volume;
			var currentSong = Playlist.findOne({'position': 0});

			// initialize the volume
			setTimeout(function() {

				if(currentSong){

					// set the slider
					this.volumeSlider = $('#volumeSlider')[0];

					// in case the slider was already initalized destroy it
					if(this.volumeSlider.noUiSlider){
						this.volumeSlider.noUiSlider.destroy();
					}

					// create the slider
					noUiSlider.create(this.volumeSlider, {
						animate: false,
						// orientation: 'vertical',
						// direction: 'rtl',
						start: volume,
						range: {
							'min': 0,
							'max': 100
						}
					});


					// when the value is changed the volume is applied
					this.volumeSlider.noUiSlider.on('update', function(){
						var newVolume = this.volumeSlider.noUiSlider.get();
						Meteor.call('volume', parseInt(newVolume));
					}.bind(this));

					// when the slider is released really set volume
					this.volumeSlider.noUiSlider.on('end', function() {
						var newVolume = this.volumeSlider.noUiSlider.get();
						Meteor.call('volume', parseInt(newVolume));
						Meteor.call('update');
					}.bind(this));

				}

			}.bind(this), 100);
		}
	}.bind(this));
});