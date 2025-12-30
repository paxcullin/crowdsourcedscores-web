'use strict';

var assert = require("assert"),
    {config} = require('./config'),
    mongo = require("mongodb").MongoClient;

const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;


// exports.handler = async (event, context, callback) => {
    const updateOddsMovement = async (event) => {
        try {
            const client = await mongo.connect(MONGO_URL);
            const db = client.db('pcsm');
            const gamesCollection = db.collection('games');
            const year = 2024;
            const season = 'pre';
            
            const aggregatedOddsValues = await gamesCollection.aggregate([
                {  $match: 
                    {
                        year,
                        season 
                    }
                },
                // {
                //         $group: {
                //             _id: "$gameId"
                //         },
                // },
                {
                    $addFields: {
                        spreadLines: {
                            $map: {
                                input: '$odds.history',
                                as: 'oddsEntry',
                                in: '$$oddsEntry.spread'
                            }
                        },
                        totalLines: {
                            $map: {
                                input: '$odds.history',
                                as: 'oddsEntry',
                                in: '$$oddsEntry.total'
                            }
                        },
                        spreadOdds: {
                            $map: {
                                input: '$odds.history',
                                as: 'oddsEntry',
                                in: '$$oddsEntry.spreadOdds'
                            }
                        },
                        totalOdds: {
                            $map: {
                                input: '$odds.history',
                                as: 'oddsEntry',
                                in: '$$oddsEntry.totalOdds'
                            }
                        }
                    }
                },

                // 2️⃣ Compute open / close / min / max
                {
                    $addFields: {
                        openSpread: { $arrayElemAt: ["$spreadLines", 0] },
                        openSpreadOdds: { $arrayElemAt: ["$spreadOdds", 0] },
                        closeSpread: { $arrayElemAt: ["$spreadLines", -1] },
                        closeSpreadOdds: { $arrayElemAt: ["$spreadOdds", -1] },
                        minSpread: { $min: "$spreadLines" },
                        maxSpread: { $max: "$spreadLines" },

                        openTotal: { $arrayElemAt: ["$totalLines", 0] },
                        openTotalOdds: { $arrayElemAt: ["$totalOdds", 0] },
                        closeTotal: { $arrayElemAt: ["$totalLines", -1] },
                        closeTotalOdds: { $arrayElemAt: ["$totalOdds", -1] },
                        minTotal: { $min: "$totalLines" },
                        maxTotal: { $max: "$totalLines" }
                    }
                },
                // 3️⃣ Movement & volatility
                {
                    $addFields: {
                        spreadMove: { $subtract: ["$closeSpread", "$openSpread"] },
                        totalMove: { $subtract: ["$closeTotal", "$openTotal"] },

                        spreadVolatility: { $stdDevPop: "$spreadLines" },
                        totalVolatility: { $stdDevPop: "$totalLines" }
                    }
                },
                // 4️⃣ Optional cleanup (keep raw history if you want)
                // {
                    // $project: {
                    //     spreadLines: 0,
                    //     totalLines: 0
                    //     // oddsHistory: 0   ← uncomment if you want it removed
                    // } /*"test": "aws lambda invoke --function-name oddsMovement --cli-binary-format raw-in-base64-out --payload file://response.json oddsMovement.json",*/
                // }
            ]).toArray();
            console.log('Aggregated odds values updated for game 4765927: ', aggregatedOddsValues[0]);
            // let updatedGame = aggregatedOddsValues[0];
            let bulkWriteCommands = []
            let i = 0
            aggregatedOddsValues.forEach(game => {
                console.log('game._id :>> ', game._id);
                if (i == 0) {
                    console.log('First game to update: ', game);
                    i += 1;
                }

                bulkWriteCommands.push({
                    updateOne: {
                        filter: {gameId: game.gameId},
                        update: { 
                            $set: {
                                "odds.spreadLines": game.spreadLines,
                                "odds.totalLines": game.totalLines,
                                "odds.openSpread": game.openSpread,
                                "odds.openSpreadOdds": game.openSpreadOdds,
                                "odds.closeSpread": game.closeSpread,
                                "odds.closeSpreadOdds": game.closeSpreadOdds,
                                "odds.minSpread": game.minSpread,
                                "odds.maxSpread": game.maxSpread,
                                "odds.openTotal": game.openTotal,
                                "odds.openTotalOdds": game.openTotalOdds,
                                "odds.closeTotal": game.closeTotal,
                                "odds.closeTotalOdds": game.closeTotalOdds,
                                "odds.minTotal": game.minTotal,
                                "odds.maxTotal": game.maxTotal,
                                "odds.spreadMove": game.spreadMove,
                                "odds.totalMove": game.totalMove,
                                "odds.spreadVolatility": game.spreadVolatility,
                                "odds.totalVolatility": game.totalVolatility
                            }
                        },
                        upsert: false
                    }
                });
            });
            const gameUpdate =  await gamesCollection.bulkWrite(bulkWriteCommands);
            console.log('gameUpdate :>> ', JSON.stringify(gameUpdate));
            client.close();
            return aggregatedOddsValues[0];
            // context.done(null, aggregatedOddsValues[0]);
        } catch (err) {
            console.error('Error updating odds movement: ', err);
            throw err;
        }

}

updateOddsMovement();
