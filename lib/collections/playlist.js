Playlist = new Mongo.Collection('Playlist');

PlaylistSchema = new SimpleSchema({
   title: {
       type: String,
       label: "titlename"
   },
    url: {
        type: String,
        label: "titleurl"
    },
    duration: {
        // TODO Number
        type: String,
        label: "duration"
    },
    file: {
        type: String,
        label: "filepath"
    },
    position: {
        type: Number,
        label: "postion"
    }
});

Playlist.attachSchema(PlaylistSchema);