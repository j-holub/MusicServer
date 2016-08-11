var gaussian = function(fileObj, readStream, writeStream) {
	gm(readStream, fileObj.name()).blur(30, 15).stream().pipe(writeStream);
}

Thumbnails = new FS.Collection('Thumbnails', {
	stores: [
		new FS.Store.FileSystem('Thumbnail'),
		new FS.Store.FileSystem('ThumbnailBlurred', {transformWrite: gaussian})
	],
	filter: {
		allow: {
			contentTypes: ['image/*'] 
		}
	}
});