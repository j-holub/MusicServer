
Template.enqueue.events({
	'click #enqueueButton': function (event) {
		// get the url
		var url = $('#enqueueInput').val();
		if(!(url === "")){	
			Meteor.call('enqueue', url, function(error, result) {
				if(!error){
					// set the input field to empty
					$('#enqueueInput').val("");
				}
				// if there was an error handle it
				else{
					if(error.error == "url_invalid"){
						alert("Not a valid URL");
					}				
				}
			});
			
		}
	}
});