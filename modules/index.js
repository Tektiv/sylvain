const Utils = require('../utils');

// All the modules needed have to be in the array
const modules = [
  './ready',
  './character',
  './roll',
  './tracker',
  './timer',
];

// For every module, we export every of its function as our own
// So that we can easily access as `Modules.<function>` and not as `Modules.<module>.<function>`
modules.forEach((module) => {
  // eslint-disable-next-line
  const library = require(module);
  Object.keys(library).forEach((functionName) => {
    exports[functionName] = library[functionName];
  });
});


/**
  * Default function when no specific command has been called
  * Useful for triggers on specific word
  *
  * @since 0.1.0
  * @author Tektiv
  * @param {Client} client - Starting point of the bot
  * @param {Message} message - Message triggering the command
  *
  * @command
  * !ping
  */
exports.default = (client, message) => {
  const { content } = message;

  if (content.endsWith('ing')) {
    message.channel.send(`${content.substring(Utils.prefix.length).replace(/ing$/, 'ong')}`);
  }
};
