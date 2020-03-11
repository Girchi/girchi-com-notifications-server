const jwt = require('jsonwebtoken');
const fs = require('fs');
const moment = require('moment');

module.exports = {
	verifyToken: token => {
		return new Promise((resolve, reject) => {
			const pub = fs.readFileSync(process.env.PUBLIC_KEY);
			jwt.verify(token, pub,(error, decoded) => {
				if (error) return reject(error);
				resolve(decoded);
			});
		});
	},
	decode: token => {
		return jwt.decode(token);
	},
	logError: log => {
		const logPath = './logs/error.log';
		const timestamp = moment().format('YYYY/MMM/DD/hh:mm A');
		log = `[${timestamp}] ${log}\n`;

		return new Promise((resolve, reject) => {
			fs.access(logPath, err => {
				if (err) {
					fs.writeFile(logPath, log, err => {
						if (err) return reject(err);
						resolve();
					});
				} else {
					fs.appendFile(logPath, log, err => {
						if (err) return reject(err);
						resolve();
					});
				}
			});
		});
	}
}
