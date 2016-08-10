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
    // id to the Thumbnail CFS Collection object
    thumbnail: {
        // type: String,
        type: FS.File,
        label: "thumbnail"
    }
});

Playlist.attachSchema(PlaylistSchema);