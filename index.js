require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors')
const path = require('path');
const fs = require('fs');
const { decode } = require('./utils');
const UserConnection = require('./models/user-connection');
const { logError } = require('./utils');

const app = express();
const http = require('http').Server(app);

const io = require('socket.io')(http);
const cookieParser = require("cookie-parser");

const notifications = require('./routes/notifications');

const accessLogStream = fs.createWriteStream(path.join(__dirname, './logs/access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

const {
	PORT = 3000,
	NODE_ENV = 'development',
	CONNECTION_STRING = 'mongodb://localhost:27017/notification',
	CONNECTION_STRING_TESTING = 'mongodb://localhost:27017/notification-testing',
} = process.env;
const connectionString = NODE_ENV === 'testing' ? CONNECTION_STRING_TESTING : CONNECTION_STRING

mongoose.connect(connectionString, { useNewUrlParser: true });

io.on('connection', socket => {
	socket.emit('connect');
	socket.on('auth', ({accessToken, refreshToken}) => {
		const { user_id } = decode(accessToken)
		UserConnection.updateOne({ uuid: user_id }, {
			uuid: user_id,
			socketId: socket.id
		}, { upsert: true }).then(userConnection => {
			// connection created
		}).catch(error => {
			logError(error.stack);
		});
	});
});

app.use((req, res, next) => {
	req.io = io;
	next();
});

app.use('/notifications', notifications);


app.use((err, req, res, next) => {
	const errorMessage = err.message || 'Internal server error';

	if (NODE_ENV === 'production') {
		logError(err.stack).then(() => {
			res.status(500).json({
				error: errorMessage
			});
		}).catch(error => {
			console.log(error);
		});
	} else {
		console.log(err);
		res.status(500).json({
			error: errorMessage
		});
	}
});


http.listen(PORT, () => {
	console.log(`running on port ${PORT}`);
});

module.exports = app;
