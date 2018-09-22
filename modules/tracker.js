const Utils = require('../utils');

// Array containing the fighters with their initiative
// and whether they are the current fighter or not
const tracker = [];

/**
  * Displays the current state of the tracker
  *
  * @since 0.1.0
  * @author Tektiv
  * @returns {String} Returns the tracker state formatted
  *
  * @example
  * > Aragorn 17
  * Wolf 15
  * Gimli 14
  * Wolf 7
  * Boromir 4
  */
const readTracker = () => {
  let string = '';
  tracker.forEach((t) => {
    if (t.active) string += '> ';
    string += `${t.name} **${t.ini}**\n`;
  });
  return string;
};


/**
  * Tracks a fight
  * Start it giving the fighters and their initiative (not needed if active character)
  * Follow the course of the fight step by step to see whose turn it is
  *
  * @since 0.1.0
  * @author Tektiv
  * @param {Client} client - Starting point of the bot
  * @param {Message} message - Message triggering the command
  *
  * @command
  * !track Aragorn, Gimli, Boromir, Wolf 2, Wolf 2
  *
  * @command
  * !track next
  */
const fightTracker = async (client, message) => {
  let { content } = message;
  content = content.substring(`${Utils.prefix}track `.length);

  if (content === '') {
    if (tracker.length === 0) {
      message.channel.send('No active tracking');
      return;
    }
  } else if (content === 'next') {
    if (tracker.length === 0) {
      message.channel.send('No active tracking');
      return;
    }
    const index = tracker.indexOf(tracker.filter(t => t.active)[0]);
    const indexNext = index === tracker.length - 1 ? 0 : index + 1;
    tracker[index].active = false;
    tracker[indexNext].active = true;
  } else {
    tracker.length = 0;
    const elements = content.split(',').map(c => c.toLowerCase().trim());
    const fighters = [];

    for (let i = 0; i < elements.length; i += 1) {
      const element = elements[i];
      if (!/^\S*(?: -?\d+)?$/.test(element)) {
        message.channel.send('Names must be a single word\nUse `!characters` to see name codes, or use the `_` character');
        return;
      }

      let [name] = element.split(' ');
      let ini = +element.split(' ')[1] || false;

      if (!ini) {
        if (!Utils.objectIncludes(Utils.game.characters, name)) {
          message.channel.send(`Name code **${name}** not found, see the list using \`!characters\``);
          return;
        }
        ini = Utils.game.characters[name].stats.dexterity.getModificator();
        ({ name } = Utils.game.characters[name]);
      }

      name = Utils.capitalize(name);

      fighters.push({ name, ini, active: false });
    }

    const randoms = await Utils.random(1, 20, fighters.length);
    for (let i = 0; i < fighters.length; i += 1) {
      fighters[i].ini += randoms[i];
    }

    fighters.sort((a, b) => (b.ini) - (a.ini));
    fighters.forEach((fighter, i) => {
      const participant = fighter;
      participant.active = i === 0;
      tracker.push(participant);
    });
  }

  message.channel.send(readTracker());
};

/**
  * Exports linking a command to a specific function
  * e.g. 'track' command triggers the `fightTracker` function
  */
module.exports = {
  track: fightTracker,
};
