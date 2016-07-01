
// converts the time string retrieved by youtube-dl to an integer containing the number of seconds
timeStringToSeconds = function(timestring) {
	var segments = timestring.split(":");

	var seconds = 0;

	for(var i = 0; i < segments.length; i++) {
		// multiplies seconds with 1, minutes with 60, hours with 3600 and so on
		seconds += parseInt(segments[i]) * Math.pow(60, segments.length - (i+1));
	}

	return seconds;
}