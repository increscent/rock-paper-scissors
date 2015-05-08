'use strict';

var uuid = require('uuid');

var Game = function () {
  this.id = uuid.v4();
  this.responses = [];
  this.players = [];
  this.losers = [];
  this.moves = {};
  this.min_players = 2;
}

Game.prototype.setMinPlayers = function (min_players) {
  if (min_players > this.min_players) this.min_players = min_players;
  if (this.min_players > 5) this.min_players = 5;
};

Game.prototype.sendData = function () {
  for (var i in this.responses) {
    this.responses[i].json({
      game_id: this.id,
      players: this.players,
      losers: this.losers,
      moves: this.moves
    });
  }
  this.losers = [];
  this.responses = [];
  this.moves = {};
};

Game.prototype.runTurn = function () {
  var min_points = this.players.length;
  var max_points = 0;
  var player_points = {};
  for (var i in this.players) {
    var id = this.players[i];
    var points = this.singlePlayerPoints(id);
    player_points[id] = points;
    if (points < min_points) min_points = points;
    if (points > max_points) max_points = points;
  }

  // make sure all the players don't have the same points
  if (min_points !== max_points) {
    for (var key in player_points) {
      if (player_points[key] === min_points) {
        // add player to losers and remove from players
        this.losers.push(key);
        this.players.splice(this.players.indexOf(key), 1);
      }
    }
  }
};

Game.prototype.singlePlayerPoints = function (player_id) {
  var move = this.moves[player_id];
  var points = 0;
  for (var i in this.players) {
    var opponent_id = this.players[i];
    var opponent_move = this.moves[opponent_id];
    points += compareMoves(move, opponent_move);
  }
  return points;
}

function min(array) {
  if (!array.length) {
    return 0;
  } else if (array.length === 1) {
    return array[0];
  } else {
    var tmp = min(array.slice(1));
    return (tmp < array[0])? tmp : array[0];
  }
}

function compareMoves(player_move, opponent_move) {
  player_move = simplifyMove(player_move);
  opponent_move = simplifyMove(opponent_move);
  var losing_move = 'p'; // loses to scissors
  if (player_move === 'r') losing_move = 's';
  if (player_move === 'p') losing_move = 'r'; 

  return (opponent_move === losing_move) ? 1 : 0;
}

function simplifyMove(move) {
  return move[0].toLowerCase();
}

module.exports = exports = Game;
