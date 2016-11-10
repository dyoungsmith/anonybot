if (process.env.NODE_ENV === 'production') {
	module.exports = require('./env-production.js');
}
else module.exports = require('./env-dev.js');
