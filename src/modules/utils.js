/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

module.exports = {
	nth: n => n+=['st', 'nd', 'rd'][((n + 90) % 100 - 10) % 10 - 1] || 'th',
	wait: time => new Promise(resolve => setTimeout(resolve, time)),
};