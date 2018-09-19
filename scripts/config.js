#!/usr/bin/env node

const Utils = require('../utils');

/**
  * Starts the project config before the first use
  * - Discord bot token is needed
  * - Random.org API key is not mandatory
  * - Port use / default 9090
  *
  * @since 0.1.0
  * @author Tektiv
  *
  * @command
  * node scripts/config.js
  */
(async function config() {
  try {
    process.chdir(`${__dirname}/..`);

    if (await Utils.fileExists('./.config.js')) {
      console.log('config file found');
    } else {
      const token = await Utils.ask('Your discord bot token ?');
      const randomKey = await Utils.ask('Your random.org api key ? (not mandatory, leave empty if none)');
      let port = await Utils.ask('Do you want to use a specific port ? (default 9090)');
      if (port === '') port = 9090;

      const configFile = `exports.token = '${token}';\nexports.randomApiKey = '${randomKey}';\nexports.port = ${port};\n`;
      await Utils.writeFile('./.config.js', configFile);

      console.log('config file created');
    }

    if (await Utils.fileExists('./data')) {
      console.log('data folder found');
    } else {
      await Utils.mkdir('data');
      console.log('data folder created');
    }

    process.chdir('data');

    const dataFiles = [
      './player.json',
      './character.json',
    ];

    await Promise.all(dataFiles.map(async (file) => {
      const name = file.replace(/^\.\/(\S*)\.json$/, '$1s');
      if (await Utils.fileExists(file)) {
        console.log(`  ${name} file found`);
      } else {
        await Utils.writeFile(file, '{}');
        console.log(`  ${name} file created`);
      }
    }));

    console.log('\nSUCCESS - initialisation done');
  } catch (e) {
    console.log(`\n${e.stack}`);
  } finally {
    process.exit();
  }
}());
