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

  const regex = /^(?:(?:\d+(?:d|D\d+|)|[a-zA-Z]+)(?: *(?:\+|-) *)?)+(?: (?:a|d))?$/g;
  if (regex.test(content)) {
    const roll = await Utils.roll(content, message);
    if (roll) {
      if (content.endsWith(' a') || content.endsWith(' d')) {
        const roll2 = await Utils.roll(content, message);
        let winner = {};
        if (content.endsWith(' a')) {
          winner = roll.total < roll2.total ? roll2 : roll;
        } else {
          winner = roll.total > roll2.total ? roll2 : roll;
        }
        message.channel.send(`${roll.steps.join(' ')} = *${roll.total}*\n${roll2.steps.join(' ')} = *${roll2.total}*\nWhich gives **${winner.total}**`);
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
