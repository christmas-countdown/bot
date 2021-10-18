const { inspect } = require('util');
const levels = ['critical', 'debug', 'error', 'info', 'notice', 'success', 'verbose', 'warn'];

for (const level of levels) {
	module.exports[level] = (...content) => {
		const strings = content.map(c => typeof c === 'string'
			? c
			: c instanceof Error
				? c.stack
				: typeof c === 'object'
					? inspect(c)
					: String(c));
		process.send({
			content: strings.join(' '),
			level: level
		});
	};
}