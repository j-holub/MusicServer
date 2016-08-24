Meteor.methods({
	getTimePos: function() {
        Status.update({}, {$set: {'currentPosition': timeposition}});
        return timeposition;
    },
    getVolume: function() {
        Status.update({}, {$set: {'volume': player_status.volume}});
        return player_status.volume;
    },
    getCurrentSong: function() {
    	return Playlist.findOne({'position': 0});
    },
    // returns the dominant color of a thumbnail image to a song
    dominantColors: function(songId) {
        var song = Playlist.findOne(songId);
        var thumbnailFile = song.thumbnail.getFileRecord({'store': 'Thumbnail'});

        var colorHex;

        // compute the dominant color
        var response = Async.runSync(function(done) {
             gm(thumbnailFile.createReadStream())
            .resize(250, 250)
            .fuzz('10%')
            .trim() // remove black borders
            .colors(2) // get the two most dominant colors
            .toBuffer('RGB', function (error, buffer) {
                // the dominant color
                colorHex = buffer.toString('hex', 3, 6);
                console.log("#" + colorHex);
                done(null, colorHex);
            });
        })

        // the dominant color
        return response.result;
    }
});