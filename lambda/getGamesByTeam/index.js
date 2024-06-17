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
    const { sport, year, season, team } = event;
    if (!sport || !year || !season) {
        return { statusCode: 400, body: JSON.stringify(`Missing required parameters sport: ${sport}, year: ${year}, season: ${season}, team: ${team}`) }
    }
    let teamGames = [];
    try {
        const client = await mongo.connect(MONGO_URL, {useUnifiedTopology: true});
        const db = client.db('pcsm');
        const collection = db.collection('games');
        teamGames = await collection.find({sport, year, season, $or: [{"awayTeam.code": team}, {"homeTeam.code": team}]}).toArray();
            
    } catch (err) {
        console.error(err);

        return {
            statusCode: 500,
            body: JSON.stringify(`Error encountered ${err}`),
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify(`${teamGames.length} returned for ${team} in ${year} ${season}`),
        teamGames
    }
}