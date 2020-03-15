const { verifyToken } = require('../utils');

module.exports = {
	hasToken: (req, res, next) => {
		const accessToken = req.cookies['g-u-at'];
		if (!accessToken)
			return next(new Error('Token not found'))

		verifyToken(accessToken)
			.then(decoded => {
				req.uuid = decoded.user_id;
				next()
			}).catch(error => next(error));
	}
}
