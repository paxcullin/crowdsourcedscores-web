const axios = require('axios');
const mongo = require('mongodb').MongoClient;
const {config} = require("./config");
const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();
const event = {};
const assert = require('assert')

/*

receive game from the data scraper lambda via subscription
gameId, sport, year, season, location, startDateTime
throw an error if any are missing
Call the Weather API
api.openweathermap.org/data/2.5/weather?q=${city}&mode=json&appid=${apikey}
If it returns empty or null, set context.done

*/
let queryPromises = [];
exports.handler = (event, context, callback) => {
    const sport = "nfl"
    // const gameWeek = await lambda.invoke({
    //     FunctionName: 'getGameWeek', // the lambda function we are going to invoke
    //     InvocationType: 'RequestResponse',
    //     LogType: 'Tail',
    //     Payload: `{ "sport" : "${sport}" }`
    //   }).promise();
    //   console.log({gameWeek})
    // const { year, season, week } = gameWeek.Payload
    // FOR local testing only
    // const { year, season, week } = {year: 2021, season: 'reg', week: 1};
    console.log('Received event :', JSON.stringify(event, null, 2));
    
    mongo.connect(MONGO_URL, (err, client) => {
        const db = client.db('pcsm')
        const collection = sport === 'nfl' ? db.collection('games') : sport === 'ncaaf' ? db.collection('games-ncaaf') : null
        assert.equal(err, null)
        console.log('collection', collection)
        
        lambda.invoke({
            FunctionName: 'getGameWeek', // the lambda function we are going to invoke
            InvocationType: 'RequestResponse',
            LogType: 'Tail',
            Payload: `{ "sport" : "${sport}" }`
        }).promise().then(gameWeek => {
            console.log(`gameWeek`, gameWeek)
            const { year, season, week } = gameWeek.Payload
            const gameQuery = {
                sport,
                year,
                season,
                gameWeek: week
            };
            console.log({gameQuery});
            collection.find(gameQuery).toArray((err, games) => {
                if (games.length === 0) {
                    return {message: 'no games returned'}
                }
                games.forEach((game, index) => {
                    console.log(`game`, game)
                    const {location, gameId} = game;
                    console.log({game})
                
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
                    if (gameId === 1235067) {
                        location = "Miami, FL"
                    }
                    console.log(`https://api.openweathermap.org/data/2.5/weather?q=${location},us&mode=json&appid=412faebda2879f5819c25e07febf9625`);
                    
                    
                
                    const options = {
                        url: `http://api.openweathermap.org/data/2.5/forecast?q=${location},us&mode=json&appid=412faebda2879f5819c25e07febf9625`
                    }
                    axios.get(options.url)
                    .then(weatherResponse => {
                        const weather = weatherResponse.data
                        
                        console.log('weather: ', weather)
                        if (!weather || !weather.list || (weather && weather.list && weather.list.length === 0)) {
                            console.log(`No weather provided for ${gameId} ${location}`)
                            return { message: 'No weather provided'}
                        }
            
                        if (!collection) {
                            return { message: 'No sport provided'}
                        }
                        
                        collection.findOne(gameQuery)
                        .then(gameResult => {
                            //console.log('game :', gameResult);
                            let gameUpdate = {}
                            let weatherArray = weather.list.filter(weatherObj => {
                                return new Date(weatherObj.dt_txt) <= gameResult.startDateTime
                            })
                            
                            // console.log('weather: ', JSON.stringify(weatherArray))
                            let upsert = true;
                            if (!gameResult) {
                                return {message: 'No game returned'}
                            }
                            
                            
                            //update game weather
                            gameUpdate = {
                                $set: {
                                    weather: {
                                        ...weatherArray[weatherArray.length -1].weather[0],
                                        ...weatherArray[weatherArray.length -1].main
                                    }
                                }
                            }
            
                            console.log('gameUpdate :', gameId, gameUpdate);
                            queryPromises.push(collection.updateOne(gameQuery, gameUpdate, { upsert: upsert }))
                            //console.log({status: game.status, gameResultStatus: gameResult.status, gameResultCrowd: gameResult.crowd})
                            
                                if (index === games.length -1) {
                                    Promise.all(queryPromises)
                                        .then(response => { console.log(`Promise response: ${JSON.stringify(response)}`);  return { message: `Response: ${queryPromises.length} updated`} })
                                        .catch(reject => { console.log(`Promise reject: ${JSON.stringify(reject)}`); return { message: `Reject: ${queryPromises.length} updated`}})
                                    context.done(null,{queryPromises: queryPromises.length})
                                }
                        })
                        .catch(gameReject => {
                            console.log('gameReject :', gameReject)
                            return { message: `${queryPromises.length} updated;`}
                        })
                    })
                    .catch(rpError => {
                        console.log('rpError :', rpError)
                        return {rpError}
                    })
                })
            })
        })
        .catch(getGameWeekError => {
            console.log(`getGameWeekError`, getGameWeekError)
            context.fail({getGameWeekError}, null)
        })
    })
}