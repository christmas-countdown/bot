/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
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

		this.defaults = require(`./${this.default_locale}.json`); // in case a file is missing messages 
		this.messages = require(`./${this.locale}.json`);
	}

	__(msg, ...args) {
		let message = get(this.messages, msg) || get(this.defaults, msg),
			i = 0;
		if (!message) return undefined; // msg not found
		if (message instanceof Array) message = args[0] === 1 ? message[0] : message[1]; // message is array, make it a string
		else if (typeof message === 'object') throw new Error(`${msg} is an invalid message key, it is an object, not an array or string.`); // message is an object and not an array
		return message.replace(/%(d|s)/g, () => args[i++]);
	}

	static get locales() {
		return fs.readdirSync(__dirname)
			.filter(file => file.endsWith('.json')) // don't include index.js 
			.map(name => name.slice(0, name.length - 5)); // remove .json from the end so it's just an array of file names without extension
	}
};