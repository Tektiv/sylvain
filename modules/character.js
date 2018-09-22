const Utils = require('../utils');

/**
  * Allow the user to call a character claimed before
  * to make it the active character
  *
  * @since 0.1.0
  * @author Tektiv
  * @param {Client} client - Starting point of the bot
  * @param {Message} message - Message triggering the command
  *
  * @command
  * !call aragorn
  */
const activateCharacter = async (client, message) => {
  const { content } = message;
  if (content.split(' ').length !== 2) return;

  const characters = await Utils.readFile('./data/character.json', true);
  const players = await Utils.readFile('./data/player.json', true);

  const [, name] = content.split(' ').map(s => s.toLowerCase());

  if (!Utils.objectIncludes(characters, name)) {
    message.channel.send(`No character is linked to **${name}**`);
    return;
  }

  if (!players[message.author.id].characters.includes(name)) {
    message.channel.send(`**${characters[name].name}** is not one of your characters\nClaim it using \`!claim ${name}\``);
    return;
  }

  if (players[message.author.id].active === name) {
    message.channel.send(`**${characters[name].name}** is already up`);
    return;
  }

  const currentActive = players[message.author.id].active;

  const result = await Utils.editJSONFile('./data/player.json', (j) => {
    const json = j;
    json[message.author.id].active = name;
    return json;
  });

  if (result) {
    const result2 = await Utils.editJSONFile('./data/character.json', (j) => {
      const json = j;
      if (currentActive !== '') {
        json[currentActive].active = false;
      }
      json[name].active = true;
      return json;
    }, string => string.replace(/\[\s*(\d*),\s*(-?\d*),\s*(true|false)\s*\]/g, '[$1, $2, $3]'));

    if (result2) {
      message.channel.send(`**${characters[name].name}** is now ready to go on an adventure`);
    }
  }
};

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

  const characters = await Utils.readFile('./data/character.json', true);
  const players = await Utils.readFile('./data/player.json', true);

  const [, name] = content.split(' ').map(s => s.toLowerCase());

  if (!Utils.objectIncludes(characters, name)) {
    message.channel.send(`No character is linked to **${name}**`);
    return;
  }

  if (characters[name].player !== '') {
    message.channel.send(`**${characters[name].name}** has already been claimed`);
    return;
  }

  const result = await Utils.editJSONFile('./data/player.json', (j) => {
    const json = j;
    if (!Utils.objectIncludes(players, message.author.id)) {
      json[message.author.id] = {
        characters: [],
        active: '',
      };
    }

    json[message.author.id].characters.push(name);
    return json;
  });

  if (result) {
    const result2 = await Utils.editJSONFile('./data/character.json', (j) => {
      const json = j;
      json[name].player = message.author.id;
      return json;
    }, string => string.replace(/\[\s*(\d*),\s*(-?\d*),\s*(true|false)\s*\]/g, '[$1, $2, $3]'));

    if (result2) {
      message.channel.send(`**${characters[name].name}** is now one of your characters\nCall it up using \`!call ${name}\``);
    }
  }
};

/**
  * Lists all the characters existing
  * - Active or not
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
  const characters = await Utils.readFile('./data/character.json', true);
  Object.keys(characters).forEach((key) => {
    const character = characters[key];
    let claimed = '';
    if (character.player !== '') {
      claimed = `claimed by _${Utils.username(Utils.memberById(client, character.player))}_`;
    } else {
      claimed = 'not claimed';
    }
    const active = character.active ? ':crossed_swords:' : ':sleeping_accommodation:';
    string += `${active} **${character.name}** [${key}], ${claimed}\n`;
  });
  message.channel.send(string);
};

/**
  * Exports linking a command to a specific function
  * e.g. 'call' command triggers the `activateCharacter` function
  */
module.exports = {
  call: activateCharacter,
  characters: listCharacters,
  claim: claimCharacter,
};
