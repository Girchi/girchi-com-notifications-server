const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
	text: { type: String, required: true },
	link: { type: String },
	isRead: { type: Boolean, default: false },
	user: { type: String, required: true },
	photoUrl: {type: String, required: false}
	
});

module.exports = mongoose.model('Notification', notificationSchema);
