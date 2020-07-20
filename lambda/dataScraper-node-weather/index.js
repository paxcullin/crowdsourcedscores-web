const rp = require('request-promise')
const mongo = require('mongodb').MongoClient
const MONGO_URL = 'mongodb://${username}:${password}@ds011775.mlab.com:11775/pcsm';

// const AWS = require('aws-sdk');    
// const SNS = new AWS.SNS({ apiVersion: '2010-03-31' });
// const sns = new AWS.SNS();

const assert = require('assert')

/*

receive game from the data scraper lambda via subscription
gameId, sport, year, season, location, startDateTime
throw an error if any are missing
Call the Weather API
api.openweathermap.org/data/2.5/weather?q=${city}&mode=json&appid=${apikey}
If it returns empty or null, set context.done

*/

exports.handler = (event, context, callback) => {

    const event = {
        sport: 'nfl',
        year: 2019,
        season: 'pre',
        gameId: 1108878,
        location: 'Canton,Ohio',
        startDateTime: '2019-08-01 17:00:00.000'
    }
    console.log('Received event :', JSON.stringify(event, null, 2));
    const { sport, year, season, gameId, startDateTime } = event 
    let { location } = event ? event : {
        location: 'Canton,Ohio'
    }

    if (location === "New England") {
        location = "Foxboro,MA"
    }
    if (location === "Minnesota") {
        location = "Minneapolis,MN"
    }
    if (location === "Carolina") {
        location = "Charlotte,NC"
    }
    if (location === "Tennessee") {
        location = "Memphis,TN"
    }
    if (location === "Arizona") {
        location = "Glendale,AZ"
    }
    console.log(`https://api.openweathermap.org/data/2.5/weather?q=${location},us&mode=json&appid=412faebda2879f5819c25e07febf9625`);
    
    

    const options = {
        url: `https://api.openweathermap.org/data/2.5/weather?q=${location},us&mode=json&appid=412faebda2879f5819c25e07febf9625`
    }
    rp(options)
    .then(async (weatherString) => {
        if (!weatherString) context.done({ message: 'No weather provided'})
        const weather = JSON.parse(weatherString)
        if (!weather || !weather.weather || (weather && weather.weather && weather.weather.length === 0) || (weather && !weather.main)) {
            context.done({ message: 'No weather provided'})
        }
        const gameQuery = {
            sport,
            year,
            season,
            gameId
        };
        mongo.connect(MONGO_URL, (err, client) => {
            assert.equal(err, null)

            const db = client.db('pcsm')
            const collection = sport === 'nfl' ? db.collection('games') : sport === 'ncaaf' ? db.collection('games-ncaaf') : null
            if (!collection) {
                context.fail({ message: 'No sport provided'})
            }
            collection.findOne(gameQuery)
            .then(gameResult => {
                //console.log('game :', gameResult);
                var gameUpdate = {}
                let upsert = true;
                if (!gameResult) {
                    context.fail({message: 'No game returned'})
                }
                
                //update game weather
                gameUpdate = {
                    $set: {
                        weather: {
                            ...weather.weather[0],
                            ...weather.main
                        }
                    }
                }

                console.log('gameUpdate :', gameUpdate);
                //queryPromises.push(collection.updateOne(gameQuery, gameUpdate, { upsert: upsert }))
                //console.log({status: game.status, gameResultStatus: gameResult.status, gameResultCrowd: gameResult.crowd})

                    
                    // Promise.all(queryPromises)
                    //     .then(response => { console.log(`Promise response: ${response}`);  context.done(null, { message: `Response: ${queryPromises.length} updated`}) })
                    //     .catch(reject => { console.log(`Promise reject: ${reject}`); context.done(null, { message: `Reject: ${queryPromises.length} updated`})})
                    return true
            })
            .catch(gameReject => {
                console.log('gameReject :', gameReject)
                if (urlIndex === (urls.length -1) && gameIndex === (games.length -1)) {
                    context.done(null, { message: `${queryPromises.length} updated; ${games.length} total games`})
                }
            })
            })
        })
        .catch(rpError => {
            console.log('rpError :', rpError)
            context.done(rpError, null)
        })
}