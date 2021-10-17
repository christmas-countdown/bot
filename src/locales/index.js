module.exports = () => {
	const {
		readdirSync,
		readFileSync
	} = require('fs');
	const { join } = require('path');
	const locales = {};
	readdirSync('./src/locales')
		.filter(file => file.endsWith('.json'))
		.forEach(file => {
			const data = readFileSync(join('./src/locales', file), { encoding: 'utf8' });
			const name = file.slice(0, file.length - 5);
			locales[name] = JSON.parse(data);
		});
	return locales;
};