const { db, Game, Player } = require("./db/server");

const seedDB = async ()=>{

    await db.sync({ force: true });

    await Game.create({
        result: "computer",
    })

    await Game.create({
      result: "human",
    });

    await Game.create({
      result: "tie",
    });
}

seedDB();

module.exports = { seedDB };