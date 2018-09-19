#!/usr/bin/env node
/* eslint-disable no-await-in-loop */

const Utils = require('../utils');

/**
  * Generates a new character that can be used in Discord afterwards
  * - Race
  * - Class
  * - Stats
  * - Name
  *
  * @since 0.1.0
  * @author Tektiv
  *
  * @command
  * node scripts/new_char.js
  */
(async function newChar() {
  try {
    process.chdir(`${__dirname}/..`);

    const race = (await Utils.ask('What\'s your race ?')).toLowerCase();
    let raceBonuses = [];
    if (Utils.objectIncludes(Utils.races, race)) {
      raceBonuses = Utils.races[race];
    } else {
      console.log('Race not found. Write your race bonuses :');
      for (let i = 0; i < Utils.attributes.length; i += 1) {
        const attribute = Utils.attributes[i];
        const bonus = await Utils.ask(`Bonus in ${attribute}`);
        raceBonuses.push(+bonus);
      }
    }

    const role = (await Utils.ask('What\'s your class ?')).toLowerCase();
    let classProficiencies = [];
    if (Utils.objectIncludes(Utils.classes, role)) {
      classProficiencies = Utils.classes[role];
    } else {
      let hasChoosenClassProf = false;
      console.log('Class not found\n');
      while (!hasChoosenClassProf) {
        for (let i = 0; i < Utils.attributes.length; i += 1) {
          const attribute = Utils.attributes[i];
          console.log(`${i + 1} - ${attribute}`);
        }
        const choice = await Utils.ask('In which stat are you proficient in ? (choose 2, e.g. "1 2")');
        if (/^\d \d$/.test(choice)) {
          hasChoosenClassProf = true;
          classProficiencies = choice.split(' ').map(c => Utils.attributes[(+c - 1)]);
        }
      }
    }

    const stats = {};
    let hasChoosenStats = false;
    let statChoice = await Utils.ask('Would you rather :\n- 1 : Write down your stats (if you already have them)\n- 2 : Buy your stats (27 points to split)\n- 3 : Roll your stats (best 3d6 out of 4d6)');
    while (!hasChoosenStats) {
      switch (statChoice) {
        case '1': {
          hasChoosenStats = true;
          for (let i = 0; i < Utils.attributes.length; i += 1) {
            const attribute = Utils.attributes[i];
            const value = await Utils.ask(`${attribute} value`);
            stats[attribute] = [value, Utils.getModif(value), false];
          }
          const removeBonus = await Utils.ask('Have you taken into account your race bonuses ? (Y/n)');
          if (removeBonus !== 'n') {
            Object.keys(raceBonuses).forEach((attribute) => {
              const newScore = stats[attribute][0] - raceBonuses[attribute];
              stats[attribute] = [newScore, Utils.getModif(newScore), false];
            });
          }
          break;
        }
        case '2': {
          hasChoosenStats = true;
          let confirmBuy = false;
          while (!confirmBuy) {
            let pointsLeft = 27;
            for (let i = 0; i < Utils.attributes.length; i += 1) {
              const attribute = Utils.attributes[i];

              let isValueRight = false;
              while (!isValueRight) {
                const value = +await Utils.ask(`How many points in ${attribute} ? (${pointsLeft} points left)`);

                let cost = 0;
                if (value <= 5) {
                  cost = value;
                } else {
                  cost = value + (value === 7 ? 2 : 1);
                }

                if (!Number.isNaN(+value)) {
                  console.log('Not a number');
                } else if (value < 0 || value > 7) {
                  console.log('A maximum of 7 points can be attributed');
                } else if (cost > pointsLeft) {
                  console.log('Not enough points left');
                } else {
                  const total = 8 + value + raceBonuses[i];
                  stats[attribute] = [total, Utils.getModif(total), false];
                  pointsLeft -= cost;
                  isValueRight = true;
                }
              }
            }

            if (pointsLeft) {
              console.log(`You have ${pointsLeft} points left, you need to spend all of them`);
            } else {
              for (let i = 0; i < Utils.attributes.length; i += 1) {
                const attribute = Utils.attributes[i];
                console.log(`${attribute} : ${stats[attribute][0]}`);
              }
              confirmBuy = await Utils.ask('Are you ok with your stats ? (Y/n)') !== 'n';
            }
          }
          break;
        }
        case '3': {
          hasChoosenStats = true;
          console.log('Your rolls :');
          for (let i = 0; i < Utils.attributes.length; i += 1) {
            const attribute = Utils.attributes[i];
            let value = ((await Utils.random(1, 6, 4, false))
              .sort((a, b) => a < b)
              .slice(0, 3)
              .reduce((a, b) => a + b));
            console.log(`- ${attribute} : ${value}`);
            value += raceBonuses[i];
            stats[attribute] = [value, Utils.getModif(value), false];
          }
          break;
        }
        default: {
          statChoice = await Utils.ask('\nPick 1, 2 or 3');
          break;
        }
      }
    }

    for (let i = 0; i < Utils.attributes.length; i += 1) {
      const attribute = Utils.attributes[i];
      stats[attribute][2] = classProficiencies.includes(attribute);
    }

    for (let i = 0; i < Object.keys(Utils.skills).length; i += 1) {
      const skill = Object.keys(Utils.skills)[i];
      const value = Utils.skills[skill];
      stats[skill] = [0, stats[value.parent][1], false];
    }

    let hasChoosenSkillProficencies = false;
    while (!hasChoosenSkillProficencies) {
      const skill = (await Utils.ask('Which skill are you proficient in ? (help to see a list, leave empty to finish)')).toLowerCase();
      if (skill === 'help') {
        console.log(Utils.arrayFormat(Object.keys(Utils.skills), ', ', ', '));
      } else if (Object.keys(Utils.skills).includes(skill.toLowerCase()) && !stats[skill][2]) {
        stats[skill][1] += 2;
        stats[skill][2] = true;
      } else if (skill === '') {
        hasChoosenSkillProficencies = true;
      } else {
        console.log('Skill not found, use "_" for skills like "animal_handling"');
      }
    }

    const fullName = (await Utils.ask('What is your full name ?')).trim();
    const nickname = (await Utils.ask('What is your nickname ? (leave empty if not)')).trim() || fullName;
    let name = nickname.toLowerCase().split(' ')[0];

    const result = await Utils.editJSONFile('./data/character.json', (j) => {
      const json = j;
      let number = 2;
      while (Utils.objectIncludes(json, name)) {
        if (number !== 2) name = name.slice(0, -2);
        name += `_${number}`;
        number += 1;
      }

      json[name] = {
        player: '',
        active: false,
        name: nickname,
        fullName,
        race,
        class: role,
        level: 1,
        ini: stats.dexterity[1],
        skills: stats,
      };

      return json;
    }, string => string.replace(/\[\s*(\d*),\s*(-?\d*),\s*(true|false)\s*\]/g, '[$1, $2, $3]'));

    if (result) {
      console.log(`\n${fullName} has been created !\nClaim it using \`!claim ${name}\` on Discord`);
    }
  } catch (e) {
    console.log(`\n${e.stack}`);
  } finally {
    process.exit();
  }
}());
