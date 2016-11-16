// This part makes the enqueue bar sticking to the top edge of the viewport when scrolled down
// below the bar, When scrolling up again it will unstick

Template.enqueue.onCreated(function() {

	$(window).on('scroll', function(event) {
		// get height of the ControlPanel which is exactly where the Enqueue bar is staring
		var barPosition = $('#controlpanel').outerHeight();
		// height of the enqueue bar
		var barHeight = $('#enqueue').outerHeight();

		// the current scrolling position
		var scrollPos = window.pageYOffset;

		// make the enqueue bar fixed
		if(scrollPos >= (barPosition)){
			$('#enqueue').addClass('sticky');
			$('body').css('padding-top', barHeight);
		}
		// unfix the enqueue bar
		else{
			$('#enqueue').removeClass('sticky');
			$('body').css('padding-top', 0);
		}

	});

});
