import fs from 'fs';
import downloader from 'youtube-dl';
import sanitize from 'sanitize-filename';
import fsw from 'file-size-watcher';


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
               duration: timeStringToSeconds(response.result.duration),
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

                  Playlist.update({_id: id}, {$set: {'file': `songs/${filename}`}});
                } 

                // playlistLength is the length BEFORE inserting the new song
                // if this is the only song in the playlist, start it
                if(playlistLength == 0){
                  if(cached){
                    // check for the filesize because when 'play' is called the early, the filesize is so small
                    // playback stops immediatly
                    var fileWatcher = fsw.watch(`songs/${filename}`).on('sizeChange', Meteor.bindEnvironment(function (newSize, oldSize){
                      // when the file is bigger than 200kB play it
                      if(newSize > 200000){
                        Meteor.call('play');
                        // release the file watcher
                        fileWatcher.stop();
                      }
                    }));                    
                  }
                  // uncached case is just streaming anyway
                  else{
                    Meteor.call('play');
                  }  
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