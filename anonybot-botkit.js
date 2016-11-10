'use strict';

const Botkit = require('botkit');
const token = require('./token.js');
const controller = Botkit.slackbot({ debug: false });
// {anonybot: U2YKC4UDQ, dyoungsmith: U2QGDD3SN, eliotpszw: U1UQF9K5H}
const fellows = require('./fellows.js'); // array of fellowIDs


// New bot instantiation
const bot = controller.spawn({
	token,
	name: 'anonybot'
});

bot.startRTM((err, bot, payload) => {
	if (err) console.error(err);
});

// Slackbot mentions in a large channel >> start DM convo
controller.hears('\S|[?]$', ['direct_mention', 'mention'], (bot, message) => {
	bot.startPrivateConversation({user: message.user}, (err, convo) => {
		if (err) console.error(err);
		convo.say('Heyyy, that doesn\'t seem very anonymous!');
		convo.say('Let\'s talk in _here_.');
		convo.say('What\'s your question?');
	});
});

// Direct messages between student and slackbot
controller.hears('\S|[?]$', ['direct_message'], (bot, question) => {
	let confirmSent = `Your question has been sent anonymously: _${question.text}_`;

	let talkToStudent = (messageForStudent) => {
		bot.reply(question, messageForStudent);
	};

	for (let fellow of fellows) {
		bot.startPrivateConversation({user: fellow}, (err, fellowConvo) => {
			if (err) console.error(err);
			// take out anonybot mention
			fellowConvo.say(`*A student has asked a question:* _${question.text}_`);


			// Does fellow ask instructor or answer directly?
			fellowConvo.ask(`Would you like to respond?`, [
				{
					pattern: bot.utterances.no,
					callback: (res, fellowConvo) => {
						fellowConvo.say('Okay, holla atcha instructor then!');
						fellowConvo.stop();	// need a better method, want to respond and then end convo
					}
				}, {
					pattern: bot.utterances.yes,
					callback: (res, fellowConvo) => {
						fellowConvo.next();
					}
				}
			]);

			// Direct response to student
			fellowConvo.ask(`So what\'s your answer? (_${question.text}_)`, (res, fellowConvo) => {
				let fellowAnswer = `*You've got an answer!* ${res.text}`;
				talkToStudent(fellowAnswer);
				fellowConvo.next();
			});
		});
	}

	talkToStudent(confirmSent);
});

// Slash commands in a large channel
// need to intercept from channel so it's not out in the open
// controller.on('slash_command', (bot, message) => {
// 	bot.replyPrivate(message, 'This is just to you?');
// });


module.exports = bot;
