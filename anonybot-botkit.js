'use strict';

const Botkit = require('botkit');
const token = require('./token.js');
const controller = Botkit.slackbot({ debug: false });
// {anonybot: U2YKC4UDQ, dyoungsmith: U2QGDD3SN, eliotpszw: U1UQF9K5H}
const fellows = ['U1UQF9K5H', 'U2QGDD3SN']


// New bot instantiation
const bot = controller.spawn({
	token,
	name: 'anonybot'
});

bot.startRTM((err, bot, payload) => {
	if (err) console.error(err);
});

// will have to do a regex for Q's
// Direct message between student and slackbot
controller.hears('hello', ['direct_message'], (bot, message) => {
	bot.startPrivateConversation({user: 'U2QGDD3SN'}, (err, convo) => {
		if (err) console.error(err);
		else {
			// take out anonybot mention
			convo.say(`*A student has asked a question:* ${message.text}`);
			bot.reply(message, 'Your question has been sent to a fellow anonymously! _Shhhhhh!_');
		}
	});
});

// Slackbot mentions in a large channel
controller.hears('hello', ['direct_mention', 'mention'], (bot, question) => {
	// for (let fellow of fellows) {
	// 	bot.say({
	// 		text: `*Someone has asked a question:* ${message.text}`,
	// 		channel: fellow
	// 	});
	// }

	bot.startPrivateConversation({user: 'U2QGDD3SN'}, (err, fellowConvo) => {
		if (err) console.error(err);
		else {
			// take out anonybot mention
			fellowConvo.say(`*A student has asked a question:* ${question.text}`);
			console.log('FELLOW CONVO', fellowConvo);
			bot.startPrivateConversation({user: question.user}, (err, studentConvo) => {
				if (err) console.error(err);
				else {
					studentConvo.say('Your question has been sent to a fellow anonymously! _Shhhhhh!_');
					console.log('STUDENT CONVO', studentConvo);
				}
			});
		}
	});

	// bot.startPrivateConversation(message, (err, convo) => {
	// 	if (err) console.error(err);
	// 	else {
	// 		bot.reply(message, 'Your question has been sent to a fellow anonymously!');
	// 	}
	// });
});

// Slash commands in a large channel
// controller.on('slash_command', (bot, message) => {
// 	bot.replyPrivate(message, 'This is just to you?');
// });


module.exports = bot;
