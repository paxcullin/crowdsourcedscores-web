const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_DB = process.env.MONGODB_DB || 'pcsm';

let cachedClient = null;
let cachedDb = null;

'use strict'
const AWSConfig = { region: "us-west-2" };
var mongo = require("mongodb").MongoClient;
const { profile } = require("console");
// const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda"); // CommonJS import

const {config} = require("./config");
const MONGODB_URI = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;


async function getDatabase() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in the environment variables.');
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(MONGODB_URI, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000
    });

    await cachedClient.connect();
    cachedDb = cachedClient.db(MONGODB_DB);
  }

  return cachedDb;
}

exports.handler = async (event) => {
  console.log('Event received:', event);

  try {
    const {
      predictionId,
      survivorTeamCode
    } = event || {};

    if (!predictionId) {
      throw new Error('Missing predictionId in event payload');
    }

    if (!ObjectId.isValid(predictionId)) {
      throw new Error(`Invalid ObjectId: ${predictionId}`);
    }


    const db = await getDatabase();
    const collection = db.collection('predictions');
    const predictionObjectId = new ObjectId(predictionId);

    console.log('Prediction ObjectId:', predictionObjectId.toString());
    const predictionObj = await collection.findOne({ _id: predictionObjectId });
    console.log('Prediction Object:', predictionObj);

    if (!predictionObj) {
      return {
        statusCode: 404,
        message: `Prediction ${predictionId} not found in ${MONGODB_DB}.predictions`,
      };
    }
    const { year, season, sport, gameWeek, userId } = predictionObj || {};
    const parsedYear = year !== undefined ? Number(year) : undefined;
    const parsedGameWeek = gameWeek !== undefined ? Number(gameWeek) : undefined;

    if (parsedYear === undefined || !season || !sport || parsedGameWeek === undefined) {
      throw new Error('Missing required filter fields: year, season, sport, and gameWeek');
    }

    const candidateFilter = {
      year: parsedYear,
      season,
      sport,
      gameWeek: parsedGameWeek,
    };

    if (userId) {
      candidateFilter.userId = userId;
    }

    const result = await collection.bulkWrite([
      {
        updateMany: {
          filter: {
            ...candidateFilter,
            _id: { $ne: predictionObjectId },
          },
          update: {
            $set: {
              isSurvivorPick: false,
              survivorPick: null,
            },
          },
        },
      },
      {
        updateOne: {
          filter: { _id: predictionObjectId },
          update: {
            $set: {
              isSurvivorPick: true,
              survivorPick: survivorTeamCode && typeof survivorTeamCode === 'object'
                ? { ...survivorTeamCode }
                : { survivorTeamCode },
            },
          },
        },
      },
    ]);

    console.log('Bulk update result:', result);

    return {
      statusCode: 200,
      message: `Survivor pick ${JSON.stringify(event)} updated successfully`,
    };
  } catch (error) {
    console.error('MongoDB Lambda error:', error);

    return {
      statusCode: 500,
      message: 'Internal server error',
      error: error.message,
    };
  }
};
