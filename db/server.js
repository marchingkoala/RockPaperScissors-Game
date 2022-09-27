const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost/rpsgame')

const Game = db.define('game', {
    // result has a string that's either "computer", "human" or "tie"
    result: {
        type: Sequelize.STRING,
        allowNull: false,
    }
})
const Player = db.define('player', {
    username: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

// const ScoreTable = db.define('scoreTable', {})

Player.hasMany(Game)
Game.belongsTo(Player)

// Player.hasMany(ScoreTable);
// ScoreTable.belongsTo(Player)

// Game.hasMany(ScoreTable)
// ScoreTable.belongsTo(Game)

module.exports = { db, Game, Player};