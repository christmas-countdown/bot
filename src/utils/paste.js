const fetch = require('node-fetch');
module.exports = async function paste(body, type = 'plain') {
	const res = fetch('https://api.pastes.dev/post', {
		body,
		headers: {
			'Content-Type': `text/${type}`,
			'User-Agent': 'ChristmasCountdown (https://christmascountdown.live)'
		},
		method: 'POST'
	});
	const j = await res.json();
	return `https://pastes.dev/${j.key}`;
};