import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import PushBullet from 'pushbullet';
import auth from './auth.pii.js';

function die(err) {
	console.error(err);
	process.exit(1);
}

const BELL = '\u0007';

const pusher = new PushBullet(auth.token);

if(process.argv.length !== 4) {
	die(`Usage: ${process.argv[0]} ${process.argv[1]} <url> <selector>`);
}

const [, , url, selector] = process.argv;

const interval = 5000;

let originalValue = null;

async function push(title, body) {
	const notification = JSON.stringify({
		type: 'note',
		title,
		body
	});

	const me = await pusher.me();

	return pusher.note(me.email, title, body);
}

async function loop() {
	fetch(url).then(res => res.text()).then(async (content) => {
		const dom = new JSDOM(content);
		const { window } = dom;
		const { document } = window;

		let nextValue = document.querySelector(selector)?.textContent;
		if(originalValue === null) {
			if(nextValue === null) {
				throw new Error('content does not exist on webpage!');
			}
			else {
				console.log(`setting initial value to ${nextValue}...`);
				originalValue = nextValue;
			}
		}
		else if(originalValue !== nextValue) {
			console.log('VALUE UPDATED:');
			console.log(`\t old: ${originalValue}`);
			console.log(`\t new: ${nextValue}`);
			console.log('sending push notification...');
			try {
				const res = await push(`Update ${url}`, `from ${originalValue} to ${nextValue}`);
			} catch(e) {
				console.error('could not send push:', e);
			}
			console.log(`updating value...`);
			originalValue = nextValue;
		}
	}).then(() => { setTimeout(loop, interval); }).catch(die);
}

loop();
