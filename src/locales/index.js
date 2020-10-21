/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license MIT
 */

const { join } = require('path');
const fs = require('fs');

const get = (obj, path) => path.split('.').reduce((acc, part) => acc && acc[part], obj);

module.exports = class I18n {
	constructor(locale) {
		this.locale = locale;

		if (!fs.existsSync(join(__dirname, this.locale + '.json')))
			this.locale = 'en-GB';

		this.messages = require(`./${this.locale}.json`);
		// console.log(I18n.locales);
	}

	__(msg, ...args) {
		let message = get(this.messages, msg),
			i = 0;
		if (!message) return undefined;
		// return format(message, ...args); // below is like util.format but doesn't add args if there's no placeholder
		return message.replace(/%(d|s)/g, () => args[i++]);
	}

	__n(msg, ...args) { // args = [num, ...args];
		let message = get(this.messages, msg),
			i = 0;
		if (!Array.isArray(message)) return null;

		return (args[0] === 1 ? message[0] : message[1]).replace(/%(d|s)/g, () => args[i++]);
	}

	static get locales() {
		let locales = fs.readdirSync(__dirname).filter(file => file.endsWith('.json'));
		return locales.map(l => l.slice(0, l.length - 5));
	}
};