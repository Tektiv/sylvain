const Utils = require('../utils');

/**
  * Chooses a random proposition among several given by the user
  *
  * @since 0.1.0
  * @author Tektiv
  * @param {Client} client - Starting point of the bot
  * @param {Message} message - Message triggering the command
  *
  * @command
  * !choose "go left" "go right" "take the ladder"
  */
const chooseForMe = async (client, message) => {
  const { content } = message;
  const regex = /(?:"([^"]*)")/g;

  if (!regex.test(content.substring(`${Utils.prefix}choose `.length))) return;

  const elements = content.substring(`${Utils.prefix}choose `.length).match(regex);
  const data = await Utils.random(0, elements.length - 1, 1);
  const choosen = elements[data[0]];

  message.channel.send(`${choosen.slice(1, choosen.length - 1)}`);
};


/**
  * Rolls a dice for the user and displays the result with the calculation
  *
  * @since 0.1.0
  * @author Tektiv
  * @param {Client} client - Starting point of the bot
  * @param {Message} message - Message triggering the command
  *
  * @command
  * !roll 1d20 - 5

  * @command
  * !roll 2d10 + 3 a
  */
const rollDice = async (client, message) => {
  let { content } = message;
  content = content.substring(`${Utils.prefix}roll `.length).trim();
  const args = content.split(' ');

  const regex = /^(?:(?:\d+(?:d\d+|))(?: *(?:\+|-) *)?)+(?: (?:a|d))?$/g;
  if (regex.test(content)) {
    const roll = await Utils.roll(content);
    if (content.endsWith('a') || content.endsWith('d')) {
      const roll2 = await Utils.roll(content);
      let winner = {};
      if (content.endsWith('a')) {
        winner = roll.total < roll2.total ? roll2 : roll;
      } else {
        winner = roll.total > roll2.total ? roll2 : roll;
      }
      message.channel.send(`${roll.steps.join(' ')} = *${roll.total}*\n${roll2.steps.join(' ')} = *${roll2.total}*\nCe qui donne **${winner.total}**`);
    } else {
      message.channel.send(`${roll.steps.join(' ')} = **${roll.total}**`);
    }
  } else {
    const character = await Utils.getActiveCharacter(message.author.id);
    if (character === 0 || character === -1) {
      message.channel.send('You have no assigned characters');
      return;
    }
    if (Utils.objectIncludes(character.skills, args[0])) {
      const skill = character.skills[args[0]];
      const roll = await Utils.roll(`1d20 ${skill[1] >= 0 ? '+' : '-'} ${Math.abs(skill[1])}`);
      if (content.endsWith(' a') || content.endsWith(' d')) {
        const roll2 = await Utils.roll(`1d20 ${skill[1] >= 0 ? '+' : '-'} ${Math.abs(skill[1])}`);
        let winner = {};
        if (content.endsWith(' a')) {
          winner = roll.total < roll2.total ? roll2 : roll;
        } else {
          winner = roll.total > roll2.total ? roll2 : roll;
        }
        message.channel.send(`${roll.steps.join(' ')} = *${roll.total}*\n${roll2.steps.join(' ')} = *${roll2.total}*\nCe qui donne **${winner.total}**`);
      } else {
        message.channel.send(`${roll.steps.join(' ')} = **${roll.total}**`);
      }
    }
  }
};

/**
  * Exports linking a command to a specific function
  * e.g. 'roll' command triggers the `rollDice` function
  */
module.exports = {
  choose: chooseForMe,
  roll: rollDice,
};
