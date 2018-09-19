const Discord = require('discord.js');
const express = require('express');

const Utils = require('./utils');
const config = require('./.config');
const modules = require('./modules');

const client = new Discord.Client();
const app = express();

// Triggered on wake up
client.on('ready', () => {
  client.user.setActivity('D&D 5e');
  console.log(`Logged in as ${client.user.tag} !`);
});

// Triggered when a user sends a message
client.on('message', (message) => {
  /**
    * Stops if :
    * - It is a direct message to the bot
    * - It is a message from the bot - you don't want him to enter an infinite loop
    * - The message doesn't start with the prefix, default '!'
    */
  if (message.channel.type === 'dm' || message.author.id === client.user.id) return;
  if (!message.content.startsWith(Utils.prefix)) return;

  // Reads the command
  // e.g. '!roll 1d20' will give 'roll'
  const [command] = message.content.substring(Utils.prefix.length).split(' ');
  // Uses the related function if known, else uses the module default function
  (modules[command] || modules.default)(client, message);
});

// Starts the bot using the token
client.login(config.token);
app.listen(process.env.PORT || config.port);
