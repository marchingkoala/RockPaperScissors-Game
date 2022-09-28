const { db, Game, Player } = require("./db/server");

const seedDB = async ()=>{

    await db.sync({ force: true });

    const susie = await Player.create({
      username: "Susie"
    })

    await Game.create({
        result: "computer",
        playerId: susie.id
    })

    await Game.create({
      result: "human",
      playerId: susie.id,
    });

    await Game.create({
      result: "tie",
      playerId: susie.id,
    });

}


seedDB();

module.exports = { seedDB };