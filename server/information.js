import cu from 'colour-utilities'

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

        // compute the dominant color
        var response = Async.runSync(function(done) {
             gm(thumbnailFile.createReadStream())
            .resize(250, 250)
            .fuzz('10%')
            .trim() // remove black borders
            .colors(1) // get the two most dominant colors
            .toBuffer('RGB', function (error, buffer) {
                if(!error){
                    // the dominant color
                    colorHex = buffer.toString('hex', 0, 3);
                    done(null, '#' + colorHex);
                }
                else{
                    // happens when the Thumbnail is not yet downloaded
                    if(error.message === "Stream yields empty buffer"){
                        done(null, null);
                    }
                }
            });
        })

        if(response.result != null){
            var colorHex = response.result;
            var colorShadeHex = cu.alterShade(colorHex, 0.2);


            // the dominant color and its shade
            return {
                'color': colorHex,
                'shade': colorShadeHex
            }
        }
        else{
            return null;
        }

    }
});