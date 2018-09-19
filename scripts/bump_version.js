#!/usr/bin/env node
/* eslint-disable no-await-in-loop */

const Utils = require('../utils');

/**
  * Bumps the project version in package.json files
  *
  * @since 0.1.0
  * @author Tektiv
  * @arg {Number} version - Project's new version
  *
  * @command
  * node scripts/bump_version.js 0.1.1
  */
(async function bumpVersion() {
  try {
    process.chdir(`${__dirname}/..`);

    if (process.argv.length === 2) {
      console.log('ERROR - no version number provided');
      process.exit();
    }

    const version = process.argv[2];

    if (/^\d+\.\d+\.\d+$/.test(version)) {
      const files = ['./package.json', './package-lock.json'];

      for (let i = 0; i < files.length - 1; i += 1) {
        const file = files[i];
        const result = await Utils.editJSONFile(file, (j) => {
          const json = j;
          json.version = version;
          return json;
        });
        if (!result) process.exit();
      }

      console.log(`SUCCESS - version bumped to ${version}`);
    } else {
      console.log('ERROR - version does not match the format x.y.z');
    }
  } catch (e) {
    console.log(`\n${e.stack}`);
  } finally {
    process.exit();
  }
}());
