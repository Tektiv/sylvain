#!/usr/bin/env node

const System = require('../utils/system');

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

    if (await System.fileExists('./.config.js')) {
      console.log('config file found');
    } else {
      const token = await System.ask('Your discord bot token ?');
      const randomKey = await System.ask('Your random.org api key ? (not mandatory, leave empty if none)');
      let port = await System.ask('Do you want to use a specific port ? (default 9090)');
      if (port === '') port = 9090;

      const configFile = `exports.token = '${token}';\nexports.randomApiKey = '${randomKey}';\nexports.port = ${port};\n`;
      await System.writeFile('./.config.js', configFile);

      console.log('config file created');
    }

    if (await System.fileExists('./data')) {
      console.log('data folder found');
    } else {
      await System.mkdir('data');
      console.log('data folder created');
    }

    process.chdir('data');

    const dataFiles = [
      './player.json',
      './character.json',
    ];

    await Promise.all(dataFiles.map(async (file) => {
      const name = file.replace(/^\.\/(\S*)\.json$/, '$1s');
      if (await System.fileExists(file)) {
        console.log(`  ${name} file found`);
      } else {
        await System.writeFile(file, '{}');
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
