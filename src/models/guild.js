const { DataTypes } = require('sequelize');

module.exports.model = {
	id: {
		type: DataTypes.CHAR(18),
		primaryKey: true
	},
	prefix: DataTypes.STRING,
	locale: DataTypes.STRING,
	timezone: DataTypes.STRING,
	channel: DataTypes.CHAR(18),
	role: DataTypes.STRING,
	auto: DataTypes.BOOLEAN,
	enabled: DataTypes.BOOLEAN,
	mention: DataTypes.BOOLEAN,
	premium: DataTypes.BOOLEAN,
	// last: DataTypes.INTEGER,
	last: DataTypes.DATE,
};

module.exports.defaults = (guild) => {
	return {
		id: guild.id,
		prefix: guild.client.config.prefix,
		locale: 'en-GB',
		timezone: 'UTC',
		channel: null,
		role: null, // these could be omitted except reset doesn't delete, these overwrite
		auto: false,
		enabled: false,
		mention: false,
		premium: false,
		last: null
	};
};
