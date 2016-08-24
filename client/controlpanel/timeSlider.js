import noUiSlider from'nouislider';

Template.controlpanel.onRendered(function() {

	// creates the slider and rerenders it everytime the current song changes
	this.autorun(function() {
		// get the current song
		var currentSong = Playlist.findOne({'position': 0});
		
		// the slider is only needed if there is a song in the query
		if(currentSong){
			// Timeout is required because onRendered and subscription.ready()
			// are still not sufficient enough
			setTimeout(function() {
				// set the slider
				this.slider = $('#timeSlider')[0];

				// in case the slider was already initalized destroy it
				if(this.slider.noUiSlider){
					this.slider.noUiSlider.destroy();
				}

				// create the noUiSlider for the song position
				noUiSlider.create(this.slider, {
					animate: false,
					start: this.clientTimePos.get(),
					range: {	
						'min': 0,
						'max': currentSong.duration
					}
				}, true);

				// slider start
				this.slider.noUiSlider.on('start', function() {
					this.sliding = true;
					$('#currentPos').addClass("change");
				}.bind(this));
				
				// slider release
				this.slider.noUiSlider.on('end', function() {
					this.sliding = false;
					$('#currentPos').removeClass("change");
				}.bind(this));

				// value is really changed (set)
				this.slider.noUiSlider.on('change', function() {
					Meteor.call('jumpTo', this.slider.noUiSlider.get());
				}.bind(this));

				// whenever the slider value is changed by the user
				this.slider.noUiSlider.on('update', function() {
					var currentSongDuration = Playlist.findOne({'position': 0}).duration;
					// set the value only when sliding
					if(this.sliding && currentSongDuration){
						$('#currentPos').html(timeFormat(this.slider.noUiSlider.get(), currentSongDuration));
					}
				}.bind(this));
					
			}.bind(this), 100);

		}
	}.bind(this));
			


});	

