
// This function takes the current position of the song and it's duration
// and nicely formats the time, considdering wether the song is over an hour
// long.
//
// @param time - current position of the playing song
// @param duration - duration of the currently playing song
// 
// @return - the time nicely formatted
timeFormat = function(time, duration) {
		
		// whole duration of the song
		var durationMinutes = Math.floor(duration/60);

		// minutes and seconds
		var minutes  = Math.floor(parseInt(time) / 60);
		var seconds = parseInt(time) % 60;

		// add leading 0 for 1 digit values
		var secondString = seconds > 9 ? `${seconds}` : `0${seconds}`;

		// check if 1 hour is exceeded
		if(minutes >= 60 || durationMinutes >= 60){
			var hours = Math.floor(minutes/60);
			minutes = minutes - (hours*60);

			// the number of hours of the song duration
			var durationHours = Math.floor(durationMinutes);

			// add leading 0 for 1 digit value
			var minuteString = minutes > 9 ? `${minutes}` : `0${minutes}`;
			var hourString   = durationHours > 9 ? `${hours}` : `0${hours}`;

			return `${hourString}:${minuteString}:${secondString}`;
		}
		// 1 hour is not exceeded
		else{
			return `${minutes}:${secondString}`;
		}
}