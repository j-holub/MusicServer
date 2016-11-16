var gaussian = function(fileObj, readStream, writeStream) {

	// only process the image if image processing is enabled
	if(Options.findOne().imageProcessing){
		gm(readStream, fileObj.name())
			.fuzz('10%')	// fuses slightly different colour values to the same value
			.trim() 		// trims borders away that have the same colour as the corner pixels
			.blur(30, 15) 	// gaussian blur
			.stream().pipe(writeStream);
	}
	else{
		readStream.pipe(writeStream);
	}
	
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
