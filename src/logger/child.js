const levels = ['critical', 'debug', 'error', 'info', 'notice', 'success', 'verbose', 'warn'];


for (const level of levels) {
	module.exports[level] = message => {
		process.send({
			content: typeof message === 'string' ? message : JSON.stringify(message),
			level: level
		});
	};
}