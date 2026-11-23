const parseTZ = require('timezone-soft');
const spacetime = require('spacetime');

const isSupported = timezone => {
	try {
		spacetime.now(timezone);
		return true;
	} catch {
		return false;
	}
};

/**
 * Resolve user input to a timezone that spacetime (and @eartharoid/christmas) accepts.
 * timezone-soft can return zones spacetime does not know (Pacific/Enderbury becomes Pacific/Kanton).
 * @param {string} input
 * @returns {string|undefined}
 */
module.exports = function resolveTimezone(input) {
	return parseTZ(input).map(result => result.iana).find(isSupported) ??
		(input.includes('/') && isSupported(input) ? input : undefined);
};
