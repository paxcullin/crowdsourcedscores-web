'use strict'
var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    {username, password} = require('./config');


const MONGO_URL = `mongodb+srv://${username}:${password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;


/* 
Get all games for a season
Iterate through each team and calculate the number of days between games
Update each game with the team's number of days between games
Post an Update Many request to the database
*/

exports.handler = async (event, context, callback) => {
    console.log(JSON.stringify(`Event: ${event}`))
    const { sport, year, season } = event;

    let lastDate = null,
    currentDate = null,
    diffDays = null,
    update = {},
    teamGames = [],
    updateMany = [];
    try {
        const client = await mongo.connect(MONGO_URL, {useUnifiedTopology: true});
        const db = client.db('pcsm');
        const collection = db.collection('games');
        const NFL_teams = ["ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE", "DAL", "DEN", "DET", "GB", "HOU", "IND", "JAC", "KC", "MIA", "MIN", "NE", "NO", "NYG", "NYJ", "LV", "PHI", "PIT", "LAC", "SEA", "SF", "LAR", "TB", "TEN", "WAS"];
        const games = await collection.find({sport, year, season}).toArray();
        const updatedGames = [];
        for (let team of NFL_teams) {
            lastDate = null;
            currentDate = null;
            diffDays = null;
            teamGames = games.filter(game => game.awayTeam.code === team || game.homeTeam.code === team).sort((a,b) => a.startDateTime - b.startDateTime);
            console.log('teamGames.length', teamGames.length)
            for (let game of teamGames) {
                update = {};
                currentDate = new Date(game.startDateTime);
                if (lastDate) {
                    let diff = currentDate - lastDate;
                    diffDays = Math.round(diff / (1000 * 60 * 60 * 24));
                    console.log(`Team ${team} has a diff of ${diffDays} days between games on ${lastDate} and ${currentDate}`);
                } else {
                    console.log(`Team ${team} has no previous game date`);
                    diffDays = -1;
                }
                
                if (game.awayTeam.code === team) {
                    update = {"awayTeam.daysBetweenGames": diffDays};
                } else {
                    update = {"homeTeam.daysBetweenGames": diffDays};
                }
                updateMany.push({updateOne: {filter: {gameId: game.gameId}, update: {$set: update}}});
                lastDate = currentDate;
            }
        }

        const bulkWriteResponse = await collection.bulkWrite(updateMany);
        
        console.log('bulkWriteResponse', JSON.stringify(bulkWriteResponse))
    } catch (err) {
        console.error(err);

        return {
            statusCode: 500,
            body: JSON.stringify(`Error encountered ${err}`),
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify(`${updateMany.length} games updated`),
    }
}