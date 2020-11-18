const { DataTypes } = require('sequelize');

module.exports.model = {
	id: {
		type: DataTypes.CHAR(11),
		primaryKey: true
	},
	name: DataTypes.STRING,
	by: DataTypes.STRING,
};
