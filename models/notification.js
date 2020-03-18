const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
	title: { type: String, required: true },
	desc: { type: String, required: true },
	type: {type: String, required: true},
	link: { type: String },
	isRead: { type: Boolean, default: false },
	user: { type: String, required: true },
	photoUrl: {type: String},
	created: {type: Date, required: true}

});

module.exports = mongoose.model('Notification', notificationSchema);
