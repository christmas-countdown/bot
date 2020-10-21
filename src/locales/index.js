/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license MIT
 */

const { join } = require('path');
const fs = require('fs');

const get = (obj, path) => path.split(/\./g).reduce((acc, part) => acc && acc[part], obj); // goodbye lodash

module.exports = class I18n {
	constructor(locale) {
		this.default_locale = 'en-GB';
		this.locale = locale;

		if (!fs.existsSync(join(__dirname, this.locale + '.json')))
			this.locale = this.default_locale;

		this.defaults = require(`./${this.default_locale}.json`);
		this.messages = require(`./${this.locale}.json`);
	}

	__(msg, ...args) {
		let message = get(this.messages, msg) || get(this.defaults, msg),
			i = 0;
		if (!message) return undefined;
		if (Array.isArray(message))
			message = args[0] === 1 ? message[0] : message[1];
		return message.replace(/%(d|s)/g, () => args[i++]);
	}

	static get locales() {
		let locales = fs.readdirSync(__dirname).filter(file => file.endsWith('.json'));
		return locales.map(l => l.slice(0, l.length - 5)); // remove .json from the end so it's just an array of file names without extension
	}
};