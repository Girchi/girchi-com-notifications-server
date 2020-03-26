const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
const { hasToken } = require('../middleware');
const UserConnection = require('../models/user-connection');
const { logError } = require('../utils');

router.post('/', (req, res, next) => {
	const notification = {
		title: req.body.title,
		title_en: req.body.title_en,
		desc: req.body.desc,
		desc_en: req.body.desc_en,
		type: req.body.type,
		link: req.body.link,
		user: req.body.user,
		photoUrl: req.body.photoUrl,
		created: Date.now()
	}

	if (!notification.title ||
		!notification.title_en ||
		!notification.user || 
		!notification.desc || 
		!notification.desc_en ||
		!notification.type) {
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
	const resPerPage = 15;
	const page = req.query.page || 1;
	
	Notification.find({
		user: req.uuid
	})
	.sort({created: 'desc'})
	.skip((resPerPage * page) - resPerPage)
	.limit(resPerPage)
	.then(notifications => {
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

router.get('/user/unread-count', hasToken, (req, res, next) => {
	Notification.find({
		user: req.uuid,
		isRead: false
	}).count().then(notifications => {
		res.status(200).json({
			"count":notifications
		});
	}).catch(error => {
		next(error);
	});
});

module.exports = router;
