// publish the options object
Meteor.publish('options', function() {
	return Options.find();
});
