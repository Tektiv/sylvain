// Prefix used for commands
exports.prefix = '!';

/**
  * Returns a member nickname or username if not
  *
  * @since 0.1.0
  * @author Tektiv
  * @param {GuildMember} member - A member on the Discord server
  * @returns {String} name - Nickname on the server, or username if not
  */
exports.username = member => member.nickname || member.user.username;

/**
  * Returns a member nickname or username if not
  *
  * @since 0.1.0
  * @author Tektiv
  * @param {Client} client - Starting point of the bot
  * @param {String} id - ID of a member of the server
  * @returns {String} name - Nickname on the server, or username if not
  */
exports.usernameById = (client, id) => this.username(client.guilds.first().members.get(id));
