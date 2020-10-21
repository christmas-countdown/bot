/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license MIT
 */

const { join } = require('path');
const fs = require('fs');
const { format } = require('util');

const get = (obj, path) => (
	path.split('.').reduce((acc, part) => acc && acc[part], obj)
);

module.exports = class I18n {
	constructor (locale) {
		this.locale = locale;

		if (!fs.existsSync(join(__dirname, this.locale + '.json')))
			this.locale = 'en-GB';
		
		this.messages = require(`./${this.locale}.json`);
		// console.log(I18n.locales);
	}

	__ (msg, ...args) {
		let message = get(this.messages, msg);
		if (!message) return undefined;
		return format(message, ...args);
	}

	__n (msg, num, ...args) {
		let message = get(this.messages, msg);
		if (!Array.isArray(message)) return null;
		if (num === 1) return format(message[0], num, ...args);
		else return format(message[1], num, ...args);
	}

	static get locales() {
		let locales = fs.readdirSync(__dirname).filter(file => file.endsWith('.json'));
		return locales.map(l => l.slice(0, l.length - 5));
	}
};