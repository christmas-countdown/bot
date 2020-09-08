const { DataTypes } = require('sequelize');

module.exports.model = {
	id: {
		type: DataTypes.STRING,
		primaryKey: true
	},
	prefix: DataTypes.STRING,
	locale: DataTypes.STRING,
	timezone: DataTypes.STRING,
	channel: DataTypes.STRING,
	role: DataTypes.STRING,
	auto: DataTypes.BOOLEAN,
	enabled: DataTypes.BOOLEAN,
	mention: DataTypes.BOOLEAN,
	premium: DataTypes.BOOLEAN,
};

module.exports.defaults = (guild) => {
	return {
		id: guild.id,
		prefix: guild.client.config.prefix,
		locale: 'en-GB',
		timezone: 'UTC',
		auto: false,
		enabled: false,
		mention: false,
		premium: false
	};
};
