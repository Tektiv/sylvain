const Utils = require('../index');

class Character {
  constructor(game, name, race, role) {
    this.game = game;
    this.name = name;
    this.race = race;
    this.role = role;
    this.stats = {};
  }

  set(property, value) {
    this[property] = value;
  }

  setStat(stat) {
    this.stats[stat.name] = stat;
  }

  getModif(stat) {
    return Utils.objectIncludes(this.stats, stat)
      ? this.stats[stat].getModif()
      : false;
  }
}

exports.Character = Character;
