const Utils = require('../utils');

/**
  * Allow the user to claim a character which is not already
  *
  * @since 0.1.0
  * @author Tektiv
  * @param {Client} client - Starting point of the bot
  * @param {Message} message - Message triggering the command
  *
  * @command
  * !claim aragorn
  */
const claimCharacter = async (client, message) => {
  const { content } = message;
  if (content.split(' ').length !== 2) return;

  const [, name] = content.split(' ').map(s => s.toLowerCase());

  if (!Utils.objectIncludes(Utils.game.characters, name)) {
    message.channel.send(`There is no character named **${name}**`);
    return;
  }

  if (Utils.game.characters[name] != null) {
    if (Utils.game.characters[name].player.member.user === message.author) {
      message.channel.send(`**${Utils.game.characters[name].name}** is already up`);
    } else {
      message.channel.send(`**${Utils.game.characters[name].name}** is used by someone else`);
    }
    return;
  }

  Utils.game.players[Utils.memberById(message.author.id)]
    .setCurrentCharacter(Utils.game.characters[name]);

  const result = await Utils.editJSONFile('./data/player.json', (j) => {
    const json = j;
    json[message.author.id].character = name;
    return json;
  });

  if (result) {
    message.channel.send(`**${Utils.game.characters[name].name}** is now ready to go on an adventure`);
  }
};

/**
  * Lists all the characters existing
  * - Name
  * - Code
  * - Player who claimed it, if claimed
  *
  * @since 0.1.0
  * @author Tektiv
  * @param {Client} client - Starting point of the bot
  * @param {Message} message - Message triggering the command
  *
  * @command
  * !characters
  */
const listCharacters = async (client, message) => {
  if (message.content !== `${Utils.prefix}characters`) return;

  let string = '';
  Object.entries(Utils.game.characters).forEach(([code, character]) => {
    let claimed = '';
    if (character.player !== null) {
      claimed = `claimed by _${Utils.username(character.player.member)}_`;
    } else {
      claimed = 'not claimed';
    }
    string += `**${character.name}** [${code}], ${claimed}\n`;
  });
  message.channel.send(string);
};

/**
  * Exports linking a command to a specific function
  * e.g. 'claim' command triggers the `claimCharacter` function
  */
module.exports = {
  characters: listCharacters,
  claim: claimCharacter,
};
