Template.options.helpers({
	downloadState: function () {
		var options = Options.findOne();
		if(options && options.download){
			return "checked"
		}
	},
	imageProcessingState: function () {
		var options = Options.findOne();
		if(options && options.imageProcessing){
				return "checked"
		}
	}
});

Template.options.events({
	'click #OptionsModal': function (event) {
		if(!(event.target != $('#OptionsModal')[0])){
			$('#OptionsModal').removeClass('active');
		}
	},

	// options
	// download
	'change #DownloadToggle': function (event) {
		Meteor.call('toggleDownloadOption');
	},
	// image processing
	'change #ImageProcessingToggle': function (event) {
		Meteor.call('toggleImageProcessingOption');
	}
})


Template.options.onCreated(function() {

	// subscribe to the options object
	this.autorun(function(){
		this.subscribe('options')
	}.bind(this));

	// The keyevent to close the OptionsModal with Escape
	$(document).on('keyup', function(event) {
		// Esc key
		if(event.keyCode == 27){
			$('#OptionsModal').removeClass('active');
		}
	});

});
