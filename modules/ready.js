const Utils = require('../utils');

const {
  Player,
  Character,
  Attribute,
  Skill,
} = Utils;

const importData = async (client) => {
  const characters = await Utils.readFile('./data/character.json', true);
  Object.entries(characters).forEach(([code, character]) => {
    const char = new Character(
      Utils.game.info,
      character.fullName,
      character.name,
      character.race,
      character.class,
    );
    Object.entries(character.stats).forEach(([stat, data]) => {
      if (Utils.attributes.includes(stat)) {
        char.setStat(new Attribute(stat, data[0], data[1], data[2]));
      } else if (Utils.objectIncludes(Utils.skills, stat)) {
        char.setStat(new Skill(stat, char.stats[Utils.skills[stat].parent], data[2]));
      }
    });
    Utils.game.characters[code] = char;
  });

  const players = await Utils.readFile('./data/player.json', true);
  Object.entries(players).forEach(([id, data]) => {
    const player = new Player(Utils.game.info, Utils.memberById(client, id));
    player.setCurrentCharacter(Utils.game.characters[data.character]);
    Utils.game.players[id] = player;
  });
};

/**
  * Exports boot/ready functions
  */
module.exports = {
  importData,
};
