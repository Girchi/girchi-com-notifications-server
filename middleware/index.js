const { verifyToken } = require('../utils');

module.exports = {
	hasToken: (req, res, next) => {
		const tokenHeader = req.get('Authorization');
		if (typeof tokenHeader !== 'string')
			return next(new Error('Token not found'))

		const token = tokenHeader.split(' ')[1];
		if (!token)
			return next(new Error('Can\'t parse token'));

		verifyToken(token)
			.then(decoded => {
				req.uuid = decoded.uuid;
				next()
			}).catch(error => next(error));
	}
}
