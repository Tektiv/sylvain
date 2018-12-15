const Globals = require('./global');

// All the basic races and their related bonuses in stats
exports.races = {
  dragonborn: [2, 0, 0, 0, 0, 1],
  dwarf: [0, 0, 2, 0, 0, 0],
  'hill dwarf': [0, 0, 2, 0, 1, 0],
  elf: [0, 2, 0, 0, 0, 0],
  'high elf': [0, 2, 0, 1, 0, 0],
  'wood elf': [0, 2, 0, 0, 1, 0],
  gnome: [0, 0, 0, 2, 0, 0],
  'rock gnome': [1, 0, 0, 2, 0, 0],
  'half-elf': [0, 0, 0, 0, 0, 2],
  'half-orc': [2, 0, 1, 0, 0, 0],
  halfling: [0, 2, 0, 0, 0, 0],
  lightfoot: [0, 2, 0, 0, 0, 1],
  human: [1, 1, 1, 1, 1, 1],
  tiefling: [0, 0, 0, 1, 0, 2],
};

// All the basic classes and their related saving throws
exports.classes = {
  barbarian: ['strength', 'constitution'],
  bard: ['dexterity', 'charisma'],
  cleric: ['wisdom', 'charisma'],
  druid: ['intelligence', 'wisdom'],
  fighter: ['strength', 'constitution'],
  monk: ['strength', 'dexterity'],
  paladin: ['wisdom', 'charisma'],
  ranger: ['strength', 'dexterity'],
  rogue: ['dexterity', 'intelligence'],
  sorceler: ['constitution', 'charisma'],
  warlock: ['wisdom', 'charisma'],
  wizard: ['intelligence', 'wisdom'],
};

// List of the 6 attributes
exports.attributes = [
  'strength',
  'dexterity',
  'constitution',
  'intelligence',
  'wisdom',
  'charisma',
];

// List of the 18 skills and their related attribute
exports.skills = {
  acrobatics: {
    parent: 'dexterity',
  },
  animal_handling: {
    parent: 'wisdom',
  },
  arcana: {
    parent: 'intelligence',
  },
  athletics: {
    parent: 'strength',
  },
  deception: {
    parent: 'charisma',
  },
  history: {
    parent: 'intelligence',
  },
  insight: {
    parent: 'wisdom',
  },
  intimidation: {
    parent: 'charisma',
  },
  investigation: {
    parent: 'intelligence',
  },
  medecine: {
    parent: 'wisdom',
  },
  nature: {
    parent: 'intelligence',
  },
  perception: {
    parent: 'wisdom',
  },
  performance: {
    parent: 'charisma',
  },
  persuasion: {
    parent: 'charisma',
  },
  religion: {
    parent: 'intelligence',
  },
  sleight_of_hand: {
    parent: 'dexterity',
  },
  stealth: {
    parent: 'dexterity',
  },
  survival: {
    parent: 'wisdom',
  },
};

/**
  * Returns the active character of a member
  *
  * @since 0.1.0
  * @author Tektiv
  * @param {String} id - ID of a member of the server
  * @returns {Object} character - Active character of the user
  */
exports.getCharacter = async (userId) => {
  if (!Globals.objectIncludes(Globals.game.players, userId)) return -1;
  if (!Globals.game.players[userId].character) return 0;
  return Globals.game.players[userId].character;
};

/**
  * Returns the active character of a member
  *
  * @since 0.1.0
  * @author Tektiv
  * @param {Number} value - Attribute value (theorically 1 to 20)
  * @returns {Number} modif - Modificator value related
  */
exports.getModif = value => Math.trunc(value / 2) - 5;

/**
  * Rolls a dice and returns the result with calculation
  * Can roll several at once and add bonuses
  * Advantage/Disadvantage
  *
  * @since 0.1.0
  * @author Tektiv
  * @param {String} request - Dice to roll
  *   e.g. 1d20 + 5 a
  * @returns {Object} result - Returns the result, with the calculation
  */
exports.roll = async (request, message) => {
  const elements = request.split(/[ +-]+/g);
  if (request.endsWith(' a') || request.endsWith(' d')) elements.pop();
  const separators = request.split('').filter(c => (c === ('+') || c === ('-'))).join('');

  const result = {
    steps: [],
    total: 0,
  };
  const results = [];

  for (let i = 0; i < elements.length; i += 1) {
    const element = elements[i];
    if (/^\d+$/.test(element)) {
      results.push(+element);
      result.steps.push(`${element}`);
    } else if (/^(\d+)d(\d+)$/.test(element)) {
      const parts = element.match(/^(\d+)d(\d+)$/);
      const data = await Globals.random(1, parts[2], parts[1]);

      result.steps.push(`(${data.join(' + ')})`);
      results.push(+data.reduce((a, b) => a + b));
    } else {
      const character = await this.getCharacter(message.author.id);
      if (character === 0 || character === -1) {
        message.channel.send('You have no assigned character');
        return false;
      }

      if (Globals.objectIncludes(character.stats, element)) {
        const skill = character.stats[element];
        const data = [+await Globals.random(1, 20, 1), +skill.getModificator()];

        result.steps.push(`[ (${data[0]}) + ${data[1]} ]`);
        results.push(data.reduce((a, b) => a + b));
      }
    }

    if (separators[i]) result.steps.push(`${separators[i]}`);
  }

  result.total = +results[0];
  for (let i = 1; i < results.length; i += 1) {
    result.total += (separators[i - 1] === '-' ? -1 : 1) * results[i];
  }

  if (result.total < 1) result.total = 1;

  return result;
};
