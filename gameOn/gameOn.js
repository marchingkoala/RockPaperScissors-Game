let result = [];

const gameOn = (yourChoice, robotsChoice) => {
  if (yourChoice === robotsChoice) {
    result.push("tie");
  } else if (yourChoice === "ROCK" && robotsChoice === "SCISSORS") {
    result.push("human");
  } else if (yourChoice === "PAPER" && robotsChoice === "ROCK") {
    result.push("human");
  } else if (yourChoice === "SCISSORS" && robotsChoice === "PAPER") {
    result.push("human");
  } else {
    result.push("computer");
  }
};

module.exports = { gameOn }