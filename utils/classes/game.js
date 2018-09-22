class Game {
  constructor(id, server) {
    this.id = id;
    this.server = server;
  }
}

class Player {
  constructor(game, member) {
    this.game = game;
    this.member = member;
    this.character = null;
  }

  setCurrentCharacter(character) {
    const char = character;
    if (this.character !== null) {
      this.character.player = null;
    }
    this.character = char;
    char.player = this;
  }
}

exports.Game = Game;
exports.Player = Player;
