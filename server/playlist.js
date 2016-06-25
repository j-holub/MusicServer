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

       // number of titles in the playlist
       var playlistLength = Playlist.find().count();

       // download the song if cached
       if(cached){

           // default arguments youtube-dl
           var args = ['--format=251/171/140/250/249/bestaudio'];

           // get the song
           var song = downloader(url, args);

           // strip the filename from characters reserved by the filesystem
           var filename = `${sanitize(response.result.title, " ")}.mp3`;

           // save the song to HDD
           song.pipe(fs.createWriteStream(`songs/${filename}`));

           var playlistEntry = {
               title: response.result.title,
               url: url,
               duration: response.result.duration,
               file: `songs/${filename}`,
               position: playlistLength,
               thumbnail: response.result.thumbnails[0].url
           };

           // TODO Error handling
           Playlist.insert(playlistEntry);

       }
       // only enter the url
       else{
           var playlistEntry = {
               tite: response.result.title,
               url: url,
               duration: response.result.duration,
               position: playlistLength,
               thumbnail: response.result.thumbnails[0].url
           }

           // TODO Error hanlding
           Playlist.insert(PlaylistEntry);
       }



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
                if(deleteCandidate.file) {
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