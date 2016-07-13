
Status = new Mongo.Collection('Status');

StatusSchema = new SimpleSchema({
	currentPosition: {
		type: Number,
		label: "currentPosition"
	},
	playing: {
		type: Boolean,
		label: "playingStatus"
	},
	volume: {
		type: Number,
		label: "volume",
		min: 0,
		max: 100
	}
});

Status.attachSchema(StatusSchema);