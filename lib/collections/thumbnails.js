Thumbnails = new FS.Collection('Thumbnails', {
	stores: [
		new FS.Store.FileSystem('Thumbnail'),
		new FS.Store.FileSystem('ThumbnailBlurred')
	],
	filter: {
		allow: {
			contentTypes: ['image/*'] 
		}
	}
});