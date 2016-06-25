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
    },
    thumbnail: {
        type: String,
        label: "thumbnail"
    }
});

Playlist.attachSchema(PlaylistSchema);