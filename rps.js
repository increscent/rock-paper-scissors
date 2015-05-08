'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Game = require('./game');
var PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/www'));
app.use(cookieParser());
app.post('*', function (req, res, next) {
  if (req.cookies.id && !req.body.id) req.body.id = req.cookies.id;
  if (req.cookies.game_id && !req.body.game_id) req.body.game_id = req.cookies.game_id;
  next();
});

var pending_game = new Game();
var current_games = {};

app.post('/joingame', function (req, res, next) {
  // make sure the id does not already exist
  if (pending_game.players.indexOf(req.body.id) !== -1) {
    res.error = 'That id has been taken';
    return next();
  }
  pending_game.players.push(req.body.id);

  if (req.body.min_players) pending_game.setMinPlayers(parseInt(req.body.min_players));

  res.cookie('id', req.body.id);
  res.cookie('game_id', pending_game.id);
  pending_game.responses.push(res);

  if (pending_game.players.length >= pending_game.min_players) {
    var game_id = pending_game.id;
    current_games[game_id] = pending_game;
    current_games[game_id].sendData();
    pending_game = new Game();
  }
});

app.post('/turn', function (req, res, next) {
  var game = current_games[req.body.game_id];
  if (!game) {
    res.error = 'That game doesn\'t exist';
    return next();
  }
  var player_id = req.body.id;
  if (game.players.indexOf(player_id) === -1) {
    res.error = 'You\'re not in the game';
    return next();
  }
  game.responses.push(res);
  game.moves[player_id] = req.body.move;

  if (game.responses.length === game.players.length) {
    game.runTurn();
    game.sendData();
  }
});

app.use( function (req, res, next) {
  if (res.error) {
    res.json({error: res.error});
  }
});

app.listen(PORT);
console.log('App listening on ' + PORT);
