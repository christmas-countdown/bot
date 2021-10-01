const levels = ['console', 'info', 'success', 'debug', 'notice', 'warn', 'error'];

for (const level of levels) {
	module.exports[level] = message => {
		process.send({
			content: typeof message === 'string' ? message : JSON.stringify(message),
			level: level
		});
	};
}