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

           // save the song to HDD
           song.pipe(fs.createWriteStream(`songs/${sanitize(response.result.title, " ")}.mp3`));

           var playlistEntry = {
               title: response.result.title,
               url: url,
               duration: response.result.duration,
               file: `songs/${response.result.title}.mp3`,
               position: playlistLength
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
               position: playlistLength
           }

           // TODO Error hanlding
           Playlist.insert(PlaylistEntry);
       }



   }
});