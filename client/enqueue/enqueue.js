
// This function is called when the button is clicked or the return key is pressed
var addSong = function() {
	// get the url
	var url = $('#enqueueInput').val();
	if(!(url === "")){	
		Meteor.call('enqueue', url, function(error, result) {
			if(!error){
				if(result){
					// set the input field to empty
					$('#enqueueInput').val("");
					// leave the focus
					$('#enqueueInput').blur();
				}
				else{
					alert("A Problem Occured");
				}
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


Template.enqueue.events({
	'click #enqueueButton': function (event) {
		addSong();
	},
	'keypress #enqueueInput': function (event) {
		// Enter / Return
		if(event.charCode == 13){
			addSong();
		}
		// Escape
		else if(event.charCode == 27){
			$('#enqueueInput').blur();
		}
	}
});