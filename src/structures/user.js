const {
	Structures
} = require('discord.js');

Structures.extend('User', User => {
	class ExtendedUser extends User {
		constructor(client, data) {
			super(client, data);

			this.settings = () => client.db.User.findOne({
				where: {
					id: this.id
				}
			});

		}
	}

	return ExtendedUser;
});