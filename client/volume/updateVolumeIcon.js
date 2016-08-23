// this will update the volume icon client only, when the slider is dragged
//
// @param vol - the volume 
//
// @return void
updateVolumeIcon = function(vol) {
	// get the icon
	var icon = $('#volumeIcon i');

	// remove the icon class
	icon.removeClass('mdi-volume-off');
	icon.removeClass('mdi-volume-low');
	icon.removeClass('mdi-volume-medium');
	icon.removeClass('mdi-volume-high');

	// set the according class
	if(vol == 0){
		icon.addClass('mdi-volume-off')
	}
	else if (vol < 33){
		icon.addClass('mdi-volume-low')
	}
	else if(vol < 66){
		icon.addClass('mdi-volume-medium')
	}
	else{
		icon.addClass('mdi-volume-high')
	}
}