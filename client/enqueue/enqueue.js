
// This function is called when the button is clicked or the return key is pressed
var addSong = function() {
	// get the url
	var url = $('#enqueueInput').val();
	if(!(url === "")){
		// set enqueuing to true
		Session.set('enqueuing', true);

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

			// when the enqueue method has returned, set the flag to false
			Session.set('enqueuing', false);
		});

	}
}

Template.enqueue.helpers({
	enqueuing: function () {
		// states whether the user is just enqueuing a song and waiting for it
		// to appear in the playlist
		return Session.get('enqueuing');
	},
	// disables the enqueue input when enqueuing
	disabled: function() {
		if(Session.get('enqueuing')){
			return "disabled";
		}
		else{
			return "";
		}
	}
});


Template.enqueue.events({
	'submit #enqueueForm': function (event) {
		// prevent Default form behaviour
		event.preventDefault();
		// if the user is not enqueuing right now, add the song
		if(!Session.get('enqueuing')){
			addSong();
		}
	},
	'keypress #enqueueInput': function (event) {
		// Escape
		// Lose focus on the input field
		if(event.charCode == 27){
			$('#enqueueInput').blur();
		}
	}
});

Template.enqueue.onCreated(function() {
	Session.set('enqueuing', false);
});
