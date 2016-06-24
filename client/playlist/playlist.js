
Template.playlist.helpers({
   listPlaylist: function() {
       return Playlist.find({}, {sort: {'position': 1}});
   }
});
