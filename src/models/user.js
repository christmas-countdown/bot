const { DataTypes } = require('sequelize');

module.exports.model = {
	id: {
		type: DataTypes.STRING,
		primaryKey: true
	},
	locale: DataTypes.STRING,
	timezone: DataTypes.STRING,
};

module.exports.defaults = (user) => {
	return {
		id: user.id,
		locale: 'en-GB',
		timezone: 'UTC'
	};
};