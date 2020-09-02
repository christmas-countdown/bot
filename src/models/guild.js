const { DataTypes } = require('sequelize');

module.exports.model = {
	id: {
		type: DataTypes.STRING,
		primaryKey: true
	},
	shard: DataTypes.INTEGER,
	prefix: DataTypes.STRING,
	locale: DataTypes.STRING,
	timezone: DataTypes.STRING,
	offset: DataTypes.STRING,
	channel: DataTypes.STRING,
	role: DataTypes.STRING,
	enabled: DataTypes.BOOLEAN,
	mention: DataTypes.BOOLEAN,
	premium: DataTypes.BOOLEAN,
};

module.exports.defaults = (guild) => {
	return {
		id: guild.id,
		shard: guild.client.shard.ids[0],
		prefix: guild.client.config.prefix,
		locale: 'en-GB',
		timezone: 'UTC',
		offset: 0,
		enabled: false,
		mention: false,
		premium: false
	};
};