
// This will apply the dominant color to all important UI elements
Template.controlpanel.onRendered(function() {

	// will get the dominant color for the current song
	this.autorun(function() {
		var currentSong = Playlist.findOne({'position': 0});

		if(currentSong){

			// Timeout to give the Thumbnail some time to be downloaded
			// Basically important on the first song entered
			// This should be changed in the future
			setTimeout(function() {

				Meteor.call('dominantColors', currentSong._id, function (error, result) {

					if(result != null && !error){

						// Control Panel Buttons
						$('.cpIcon').hover(function() {
							$(this).css({'color': result.color});
						}, function() {
							$(this).css({'color': '#292f33'});
						});

						// Slider
						// background
						$('.noUi-background').css({
							'background-color': result.color
						});

						// handle knob
						$('.noUi-handle').css({
							'background-color': result.color,
							'border-color': result.color
						});
						$('.noUi-handle').hover(function() {
							$(this).css({
								'background-color': result.shade,
								'border-color': result.shade
							});
						}, function() {
							$(this).css({
								'background-color': result.color,
								'border-color': result.color
							});
						});


						// Modals
						$('.modalHeader').css({
							'border-color': result.color
						});

						
						// Enqueue Bar
						$('#enqueueButton').css({
							'background-color': result.color
						});
						$('#enqueueButton').hover(function() {
							$(this).css({
								'background-color': result.shade
							});
						}, function() {
							$(this).css({
								'background-color': result.color
							});
						});

					}
		
				});

			}, 150);
		}
	});

});