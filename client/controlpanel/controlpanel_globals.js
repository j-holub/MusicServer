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
	var minutes = Math.floor(time/60);
	var seconds = time % 60;

	if(seconds>9){
		$('#timepos').text(`${minutes}:${seconds}`);
	}
	else{
		$('#timepos').text(`${minutes}:0${seconds}`);
	}
}