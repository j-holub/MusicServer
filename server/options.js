Meteor.methods({
	// toggles the download option
	toggleDownloadOption: function() {
		var currentValue = Options.findOne().download;
		Options.update({}, {$set: {download: !currentValue}});
	},
	toggleImageProcessingOption: function() {
		var currentValue = Options.findOne().imageProcessing;
		Options.update({}, {$set: {imageProcessing: !currentValue}});
	}
})
