const devEnv = require('./env-dev.js');
const productionEnv = require('./env-production.js');

if (process.env.NODE_ENV === 'production') {
	module.exports = productionEnv;
}
else module.exports = devEnv;
