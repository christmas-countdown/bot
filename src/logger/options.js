const {
	ConsoleTransport,
	FileTransport
} = require('leekslazylogger/dist/transports');
const { short } = require('leeks.js');
const DTF = require('@eartharoid/dtf');
const dtf = new DTF('en-GB');
const formats = {
	critical: ['🛑', '&0&!4', '&4', '&0&!c'],
	debug: ['🔇', '&0&!1', '&1', '&9'],
	error: ['‼️', '&0&!4', '&4', '&c'],
	info: ['ℹ️', '&0&!3', '&3', '&b'],
	notice: ['📣', '&0&!6', '&6', '&0&!e'],
	success: ['✅', '&0&!2', '&2', '&a'],
	verbose: ['💬', '&0&!f', '&r', '&r'],
	warn: ['⚠️', '&0&!6', '&6', '&e']
};

module.exports = {
	namespaces: ['dispatcher', 'http', 'manager'],
	transports: [
		new ConsoleTransport({
			format: function (log) {
				const timestamp = dtf.fill('DD/MM/YY HH:mm:ss', log.timestamp);
				const format = formats[log.level.name];
				return short(`&!7&f ${timestamp} &r ${format[1]} ${log.level.name} &r ${log.namespace ? `${format[2]}(${log.namespace})&r ` : ''}${format[0]}  ${format[3] + log.content}`);
			},
			level: 'info'
		}),
		new FileTransport({
			format: function (log) {
				const timestamp = dtf.fill('DD/MM/YY HH:mm:ss', log.timestamp);
				const format = formats[log.level.name];
				return `${timestamp} ${log.level.name} ${log.namespace ? `(${log.namespace}) ` : ''}${`${log.file}:${log.line}:${log.column}`} ${format[0]} ${log.content}`;
			},
			level: 'verbose',
			name: 'Christmas Countdown Bot'
		})
	]
};