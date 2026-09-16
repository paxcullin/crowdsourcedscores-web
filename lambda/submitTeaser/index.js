const { MongoClient } = require('mongodb');
const {config} = require("./config");
const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;
// const getMongoUri = () => process.env.MONGO_URI || process.env.MONGODB_URI;

const sendResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
  },
  body: JSON.stringify(body)
});

const parseRequestBody = (event) => {
  if (!event) {
    return {};
  }

  if (typeof event === 'string') {
    try {
      return JSON.parse(event);
    } catch (error) {
      return {};
    }
  }

  if (event.body) {
    if (typeof event.body === 'string') {
      try {
        return JSON.parse(event.body);
      } catch (error) {
        return {};
      }
    }

    return event.body;
  }

  return event;
};

exports.handler = async (event) => {
  if (event && event.httpMethod === 'OPTIONS') {
    return sendResponse(200, { ok: true });
  }
  console.log('event: ', JSON.stringify(event));

  // const mongoUri = getMongoUri();
  // if (!mongoUri) {
  //   return sendResponse(500, {
  //     error: 'MONGO_URI is not configured.'
  //   });
// }

  let payload;
  try {
    payload = parseRequestBody(event);
  } catch (error) {
    return sendResponse(400, {
      error: 'Invalid JSON body.'
    });
  }
  console.log('payload: ', JSON.stringify(payload));

  const teaser = payload.content.teaser || payload;
  if (!teaser || typeof teaser !== 'object' || Array.isArray(teaser)) {
    return sendResponse(400, {
      error: 'A teaser object is required.'
    });
  }

  const document = {
    usedId: payload.userId,
    gameIdsArray: JSON.parse(teaser.gameIdsArray) || [],
    predictionsArray: JSON.parse(teaser.predictionsArray) || [],
    sport: teaser.sport || 'unknown',
    season: teaser.season || 'unknown',
    year: teaser.year || 'unknown',
    gameWeek: teaser.gameWeek || 'unknown',
    wager: JSON.parse(teaser.wager) || {},
    type: teaser.type || 'teaser',
    createdAt: new Date().toISOString()
  };
  if (!document || 
    typeof document !== 'object' || 
    document.sport === 'unknown' || 
    document.season === 'unknown' || 
    document.year === 'unknown' || 
    document.gameWeek === 'unknown' || 
    Object.keys(document.wager).length === 0 || 
    document.gameIdsArray.length === 0 || 
    document.predictionsArray.length === 0) {
    return sendResponse(400, {
      error: 'There is something missing in the teaser.'
    });
  }

  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();

    const db = client.db('pcsm');
    const collection = db.collection('wagers');

    const result = await collection.insertOne(document);
    console.log('result: ', JSON.stringify(result));
    return sendResponse(200, {
      message: 'Teaser submitted successfully.',
      id: result.insertedId.toString(),
      teaser: document
    });
  } catch (error) {
    return sendResponse(500, {
      error: 'Failed to submit teaser.',
      details: error.message
    });
  } finally {
    await client.close();
  }
};
