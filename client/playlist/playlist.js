
Template.playlist.helpers({
   listPlaylist: function() {
       return Playlist.find({'position': {$gte: 1}}, {sort: {'position': 1}});
   }
});
