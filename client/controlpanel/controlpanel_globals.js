// global variable for the song time position
clientTimePos = 0;
playingStatus = false;

// interval timer
intervalTimer = null;
updateTimer = function( ){
	if(playingStatus){
		// increase the timer
		clientTimePos += 1;

		minutes = Math.floor(clientTimePos / 60);
		seconds = clientTimePos % 60;

		if(seconds>9){
			timePosString = `${minutes}:${seconds}`;
		}
		else{
			timePosString = `${minutes}:0${seconds}`;
		}

		$('#timepos').text(timePosString);

	}
}