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
        type: Number,
        label: "duration"
    },
    file: {
        type: String,
        label: "filepath",
        optional: true
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