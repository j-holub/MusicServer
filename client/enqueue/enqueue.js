
Template.enqueue.events({
	'click #enqueueButton': function (event) {
		// get the url
		var url = $('#enqueueInput').val();
		if(!(url === "")){	
			Meteor.call('enqueue', url);
			// set the input field to empty
			$('#enqueueInput').val("");
		}
	}
});