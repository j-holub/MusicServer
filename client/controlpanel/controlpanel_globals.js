// global variable for the song time position
clientTimePos = 0;
playingStatus = false;

// interval timer
intervalTimer = null;
// required to clear the interval
updateTimer = function( ){
	if(playingStatus){
		// increase the timer
		clientTimePos += 1;

		// set the time in the UI
		setTimeUI(clientTimePos);
	}
}


// sets the client time position in the UI
setTimeUI = function(time) {
	var minutes  = Math.floor(time / 60);
	var seconds = time % 60;

	// add leading 0 for 1 digit values
	var secondString = seconds > 9 ? `${seconds}` : `0${seconds}`;

	// check if 1 hour is exceeded
	if(minutes >= 60){
		var hours = Math.floor(minutes/60);
		minutes = minutes - (hours*60);

		// add leading 0 for 1 digit value
		var minuteString = minutes > 9 ? `${minutes}` : `0${minutes}`;

		$('#timepos').text(`${hours}:${minuteString}:${secondString}`);
	}
	// 1 hour is not exceeded
	else{
		$('#timepos').text(`${minutes}:${secondString}`);
	}
}