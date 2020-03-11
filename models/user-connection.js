const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
	uuid: { type: String, required: true },
	socketId: { type: String, required: true }
});

module.exports = mongoose.model('UserConnection', notificationSchema);
