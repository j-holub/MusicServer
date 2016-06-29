
Status = new Mongo.Collection('Status');

StatusSchema = new SimpleSchema({
	currentPosition: {
		type: Number,
		label: "currentPosition"
	},
	playing: {
		type: Boolean,
		label: "playingStatus"
	}
});

Status.attachSchema(StatusSchema);