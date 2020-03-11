const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
const { hasToken } = require('../middleware');
const UserConnection = require('../models/user-connection');
const { logError } = require('../utils');

router.post('/', (req, res, next) => {
	const notification = {
		text: req.body.text,
		link: req.body.link,
		user: req.body.user,
		photoUrl: req.body.photo_url
	}

	if (!notification.text || !notification.user) {
		return next(new Error('Invalid notification'));
	}

	Notification
		.create(notification)
		.then(notification => {
			return UserConnection.findOne({ uuid: notification.user });
		}).then(connection => {
			if (connection)
				req.io.to(connection.socketId).emit('notification added', notification);

			res.status(201).send({
				message: 'Notification created',
				notification
			});
		}).catch(error => {
			next(error);
		});
});

router.get('/user', hasToken, (req, res, next) => {
	Notification.find({
		user: req.uuid
	}).then(notifications => {
		res.status(200).json({
			notifications
		});
	}).catch(error => {
		next(error);
	});
});

router.post('/:id/read', hasToken, (req, res, next) => {
	const { id } = req.params;
	Notification.updateOne({
		_id: id,
		user: req.uuid
	}, {
		$set: { isRead: true }
	}).then(notification => {
		res.status(200).json({
			message: 'Notification set to read'
		});
	}).catch(error => {
		next(error);
	});
});

router.get('/user/unread', hasToken, (req, res, next) => {
	Notification.find({
		user: req.uuid,
		isRead: false
	}).then(notifications => {
		res.status(200).json({
			notifications
		});
	}).catch(error => {
		next(error);
	});
});


module.exports = router;
