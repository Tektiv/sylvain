const Utils = require('../utils');

/**
  * Starts a timer counting to 0
  *
  * @since 0.2.0
  * @author Tektiv
  * @param {Client} client - Starting point of the bot
  * @param {Message} message - Message triggering the command
  *
  * @command
  * !timer 2m 30s
  */
const timer = async (client, message) => {
  let { content } = message;
  content = content.substring(`${Utils.prefix}timer `.length);

  const regex = /^(?:(\d+)\s*m)? *(?:(\d+)\s*s)?$/;
  let time = 0;
  if (/^\d*$/.test(content)) {
    time += +content;
  } else if (regex.test(content)) {
    const match = content.match(regex);
    console.log(match);
    if (match[1] !== undefined) {
      time += +match[1] * 60;
    }
    if (match[2] !== undefined) {
      time += +match[2];
    }
  } else {
    return;
  }

  if (Number.isNaN(time)) return;

  let emoji = ':hourglass:';

  message.channel.send(`${emoji} ${time}`).then((msg) => {
    const interval = setInterval(() => {
      time -= 1;
      emoji = (emoji === ':hourglass:' ? ':hourglass_flowing_sand:' : ':hourglass:');

      msg.edit(time === 0 ? ':alarm_clock: Time\'s up !' : (`${emoji} ${time}`));

      if (time === 0) {
        clearInterval(interval);
      }
    }, 1000);
  });
};

/**
  * Exports linking a command to a specific function
  * e.g. 'timer' command triggers the `timer` function
  */
module.exports = {
  timer,
};
