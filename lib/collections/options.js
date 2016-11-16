Options = new Mongo.Collection('Options')

OptionSchema = new SimpleSchema({
	download: {
		type: Boolean,
		label: "Download",
		defaultValue: true
	},
	imageProcessing: {
		type: Boolean,
		label: "Image Processing",
		defaultValue: true
	}
});

Options.attachSchema(OptionSchema)
