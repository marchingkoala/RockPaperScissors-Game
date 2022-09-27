const express = require("express");
const router = express.Router();

const volleyball = require("volleyball");
router.use(volleyball);

const path = require("path");
const middleware = express.static(path.join(__dirname, "style"));
const imgware = express.static(path.join(__dirname, "/"));

router.use(middleware);
router.use(imgware);

const { db, Game, Player, ScoreTable } = require("../db/server");
router.use(express.urlencoded({ extended: false }));

//here, player can enter their name into form/input field.
// name gets stored in postgres player's module
// moves to /game field where player can play the rps game
router.get("/", async (req, res, next) => {
  try {
    res.send(`
        <head>
    <title>Welcome to the pit</title>
    <link rel="stylesheet" href="/style/style.css">
</head>
<body>   
        <h2>Welcome to the Battle of Rock, Paper, Scissors!</h2>
    <div class="register">
        <p>Register below to enter the arena</p>
    </div>
    <div class="form">
          
          <form method = "POST" action="/">
      
              <label for="name">Name of the Player</label><br>
              <input type="text" id="name" name="name"><br>
      
              <input type="submit" value="Enter the Arena">
          </form>
    </div>
    
</body>
</html>
        `);
  } catch (error) {
    next(error);
  }
});

// this is where game is going to start
// player will choose r/p/s
router.get("/game", async (req, res, next) => {
  const gameresult = await Game.findAll({});
  try {
    res.send(`<html lang="en">
<head>
    <title>Welcome to the pit</title>
    <link rel="stylesheet" href="/style/style.css">
</head>
<body>   
<div class="playinfield">

    <div class="computerImg">
        <img src="./imgs/robot.png" width="300" height="auto">
    </div>
    <div class="spaceHolder">
            <div class="chosenOp"></div>
            <div class="chosenMe"></div>
        </div>
    <div class="choices">
        <form method = "POST" action="/game">

            <input type="submit" id="rock" name="rock" value="ROCK">
            <input type="submit" id="paper" name="paper" value="PAPER">
            <input type="submit" id="scissors" name="scissors" value="SCISSORS">
        
            </form>
    </div>
    <div class="playerImg">
        <img src="./imgs/brain.png" width="300" height="auto">
    </div>

</div>
    
</body>
</html>`);
  } catch (error) {
    next(error);
  }
});

// return the winner of the game matching the give ID as well as the palyer for the game
router.get("/game/:gameId", async (req, res, next) => {
  try {
    const realID = +req.params.gameId;
    const gameRow = await Game.findByPk(realID);

    res.send(`<html lang="en">
    <head>
    <link rel="stylesheet" href="/style/style.css">
    </head>
        <body>
        <div>
        <p>
        The game is ${gameRow.result}
        </p>
        </div>
        </body>`);
  } catch (error) {
    next(error);
  }
});

// returns a list of all player
router.get("/player", async (req, res, next) => {
  try {
    const allPlayers = await Player.findAll({});
    res.send(`<html lang="en">
<head>
    <title>Welcome to the pit</title>
    <link rel="stylesheet" href="/style/style.css">
</head>
<body>
        ${allPlayers
          .map(
            (player) =>
              `<h2>Brave Warrior #${player.id}</h2>
            <p>${player.username}</p>
            `
          )
          .join("")}
</body>`);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    await Player.create({
      username: req.body.name,
    });
    res.redirect("/game");
  } catch (error) {
    next(error);
  }
});

router.post("/game", async (req, res, next) => {
  try {
    const clicked = await req.body;
    let clickedVal = Object.values(clicked)[0];
    const choices = ["ROCK", "PAPER", "SCISSORS"];
    const randomNum = Math.floor(Math.random() * 3);
    let robotsChoice = choices[randomNum];
    let finalResult = "";

    const user = await Player.findAll();

    const gameOn = (yourChoice, robotsChoice) => {
      if (yourChoice === robotsChoice) {
        finalResult = "tie";
      } else if (yourChoice === "ROCK" && robotsChoice === "SCISSORS") {
        finalResult = "human";
      } else if (yourChoice === "PAPER" && robotsChoice === "ROCK") {
        finalResult = "human";
      } else if (yourChoice === "SCISSORS" && robotsChoice === "PAPER") {
        finalResult = "human";
      } else {
        finalResult = "computer";
      }
    };
    await gameOn(clickedVal, robotsChoice);

    const gameResult = await Game.findOne({
      where: {
        result: `${finalResult}`,
      },
    });

    await Game.update(
      {playerId: user.id}, {where: {result : `${finalResult}`}}
   )

    console.log(gameResult.id);

    // res.send(`The Winner is a ${finalResult}`);
    res.redirect(`/game/${gameResult.id}`);
  } catch (error) {
    next(error);
  }
});



router.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(404).send("Something's off!");
});

module.exports = router;