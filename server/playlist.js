import fs from 'fs';
import downloader from 'youtube-dl';
import sanitize from 'sanitize-filename'


Meteor.methods({
    // enqueues a song to the playlist
   'enqueue': function(url){

        // DEBUG
       console.log("enqueue url " + url);

       // get some songinfo
       var response = Async.runSync(function(done){
           downloader.getInfo(url, function(err, info){
               done(null, info);
           }) ;
       });

       // check wether youtube-dl was able to handle the url
       if(!response.result){
            throw new Meteor.Error('url_invalid', 'url was not valid');
       }

       // number of titles in the playlist
       var playlistLength = Playlist.find().count();

       // create the entry attributes
       var playlistEntry = {
               title: response.result.title,
               url: url,
               duration: response.result.duration,
               position: playlistLength,
               thumbnail: response.result.thumbnails[0].url
      };

      // insert the song
      Playlist.insert(playlistEntry, function(error, id){
            if(!error){
                  // if cached download the song
                  if(cached){
                      // default arguments youtube-dl
                      var args = ['--format=251/171/140/250/249/bestaudio'];

                       // get the song
                       var song = downloader(url, args);

                       // strip the filename from characters reserved by the filesystem
                       var filename = `${sanitize(response.result.title, " ")}.mp3`;

                       // save the song to HDD
                       song.pipe(fs.createWriteStream(`songs/${filename}`));

                       Playlist.update({_id: id}, {$set: {'file': `songs${filename}`}});
                } 
            }
            else{
                console.log("Error in enqueue: " + error.message);
            }
      });
   },
    // deletes an entry in the playlist
    'delete': function(pos){
        // it is not possible to delete the currently playing song
        if(pos == 0){
            return false;
        }
        // pos >= 1
        else {
            var deleteCandidate = Playlist.findOne({'position': pos});

            // if the position is avaiable
            if (deleteCandidate) {
                // delete associated file
                if(deleteCandidate.file && fs.existsSync(deleteCandidate.file)) {
                    fs.unlinkSync(deleteCandidate.file);
                }
                // remove the entry from the playlist
                Playlist.remove(deleteCandidate._id);
                // adjust playist positions
                Playlist.update({
                    'position': {$gte: pos}
                },
                {
                    $inc: {'position': -1}
                },
                {
                    $multi: true
                });

                return true;
            } else {
                return false;
            }
        }
    },
    // clears the whole playlist
    clear: function() {
        Playlist.find().fetch().forEach(function (title) {
            if(title.file){
                fs.unlinkSync(title.file);
            }
            Playlist.remove(title._id);
        });
    }
});