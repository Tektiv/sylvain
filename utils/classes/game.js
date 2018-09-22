class Game {
  constructor(id, server) {
    this.id = id;
    this.server = server;
  }
}

class Player {
  constructor(game, user) {
    this.game = game;
    this.user = user;
    this.character = null;
  }

  setCurrentCharacter(character) {
    this.character = character;
  }
}

exports.Game = Game;
exports.Player = Player;
