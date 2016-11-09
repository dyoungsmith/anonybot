'use strict';

const SlackBot = require('slackbots');
const token = require('./token.js');

// import SlackBot from 'slackbots';
// import token from './token.js';


const bot = new SlackBot({
	token,
	name: 'anonybot'
});

bot.on('start', () => {
	bot.postMessageToUser('dyoungsmith', 'Ask ALL the anonymous questions', {as_user: true})
	.then(() => {
		console.log('MSG POSTED TO DANI YS');
	})
	.catch((error) => {
		console.error(error);
	});
});

bot.on('message', (message) => {
	// console.log('THIS', this);
	// console.log('BOT', bot);
	console.log('MSG', message);
	// console.log('CHANNEL', message.channel);
	console.log('you sent AnonyBot a message!');
	if (message.user === 'dyoungsmith') {
		console.log('DANI IS ALIIIIIIVE');
	}
});




// export default bot;

module.exports = bot;
