import noUiSlider from'nouislider';

Template.controlpanel.onRendered(function() {
	// handle the volume slider
	this.autorun(function() {
		var statusSubscription = this.subscribe('status');
		var songSubscription = this.subscribe('currentSong');

		if(statusSubscription.ready() && songSubscription.ready()){

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
						orientation: 'vertical',
						direction: 'rtl',
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