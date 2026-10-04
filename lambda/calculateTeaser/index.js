const { MongoClient } = require('mongodb');
const {config} = require("./config");
const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;


const TEASER_POINTS = Number(process.env.TEASER_POINTS || 6);


function formatDisplayedOdds(odds, format = 'american') {
  if (odds === null || odds === undefined || odds === '') {
    return 0;
  }

  const numericOdds = Number(odds);
  if (!Number.isFinite(numericOdds)) {
    return 0;
  }

  return format === 'decimal' ? numericOdds : numericOdds;
}

function getSpreadValue(selection) {
  const predictionOdds = selection?.prediction?.odds || {};
  const gameOdds = selection?.game?.odds || {};
  return Number(selection?.spread ?? predictionOdds?.spread ?? gameOdds?.spread ?? 0);
}

function evaluateNet(odds, currency) {
  const numericOdds = Number(parseInt(odds));
  console.log('evaluateNet called with odds:', odds, 'currency:', currency, 'numericOdds:', numericOdds);
  if (!Number.isFinite(numericOdds)) {
    return null;
  }
    if (numericOdds < 1) {
        // multiply odds by result
        // any negative odds mean the amount you need to bet to win 100
        // so -174 means 174 to win 100
        // therefore 100/174 = resulting value / your wager
        return Math.round((((100/numericOdds) * -1) * currency) + currency)
    } else {
        return Math.round((currency * (numericOdds/100)) + currency);
    }
}

function resolveParticipantId(selection, game) {
  console.log('resolveParticipantId called with selection:', selection, 'and game:', game?.gameId);
  if (selection?.participantId) {
    return selection.participantId;
  }
  console.log('no participantId found in selection');
  const {predictionsArray} = selection
  


  const homeId = game?.homeTeam?.participantId;
  const awayId = game?.awayTeam?.participantId;

  if (selection?.team && typeof selection.team === 'string') {
    const team = selection.team.toLowerCase();
    if (team.includes('home')) {
      return homeId;
    }
    if (team.includes('away')) {
      return awayId;
    }
  }

  const homeScore = Number(selection?.prediction?.homeTeam?.score ?? selection?.game?.homeTeam?.score ?? 0);
  const awayScore = Number(selection?.prediction?.awayTeam?.score ?? selection?.game?.awayTeam?.score ?? 0);
  const spread = getSpreadValue(selection);

  return homeScore + spread > awayScore ? homeId : awayId;
}

function evaluateLeg(selection, legGame, adjustedLine) {
  // const game = selection?.game || {};
  const homeId = legGame?.homeTeam?.participantId ?? selection?.homeTeam?.participantId;
  const awayId = legGame?.awayTeam?.participantId ?? selection?.awayTeam?.participantId;
  const participantId = resolveParticipantId(selection, legGame);
  const isHomeSelected = participantId === homeId;
  console.log({ participantId, isHomeSelected, awayTeam: legGame.awayTeam, homeTeam: legGame.homeTeam });
  if (!legGame.results?.homeTeam?.score || !legGame.results?.awayTeam?.score) {
    console.log('Missing scores for legGame:', legGame, selection);
    return { participantId: resolveParticipantId(selection, legGame), result: 0 };
  }
  const homeScore = Number(legGame.results.homeTeam.score);
  const awayScore = Number(legGame.results.awayTeam.score);
  const selectedParticipantScore = isHomeSelected ? homeScore : awayScore;
  const selectedParticipantCode = isHomeSelected ? legGame.homeTeam.code : legGame.awayTeam.code;
  const otherParticipantScore = isHomeSelected ? awayScore : homeScore;
  console.log({ selectedParticipantScore, adjustedLine, otherParticipantScore, selectedParticipantCode });
  if (selectedParticipantScore + adjustedLine > otherParticipantScore) {
    return { participantId, result: 1 };
  }

  if (selectedParticipantScore + adjustedLine < otherParticipantScore) {
    return { participantId, result: -1 };
  }

  return { participantId, result: 0 };
}

function getAdjustedTeaserOdds(originalOdds, activeLegCount) {
  const table = {
    2: -110,
    3: 180,
    4: 300,
    5: 450,
    6: 600,
  };

  if (Number.isFinite(Number(originalOdds))) {
    return Number(originalOdds);
  }

  return table[activeLegCount] ?? 0;
}

function calculateTeaser(wagerObj, gamesArray) {
  const { wager, year, season, gameWeek } = wagerObj;
  const { legs = [], teaser, currency, odds } = wager;
  const legCount = legs.length;
  console.log('wager._id', wagerObj._id);
  const evaluatedLegs = legs.map((leg) => {
    const legGame = gamesArray.find((game) => String(game.gameId) === String(leg.gameId));
    const selection = {
      ...leg,
      game: legGame || leg.game || {},
      prediction: leg.prediction || legGame?.prediction || {},
    };

    const originalLine = getSpreadValue(selection);
    // const adjustedLine = originalLine + TEASER_POINTS;
    const { participantId, result } = evaluateLeg(selection, legGame, leg.spreadTotal);
    console.log({ participantId, result });
    return {
      ...leg,
      participantId,
      result,
      settled: true,
    };
  });

  const pushLegs = evaluatedLegs.filter((leg) => leg.result === 0);
  const activeLegs = evaluatedLegs.filter((leg) => leg.result !== 0);

  let finalResult = 1;

  if (legCount === 2 && pushLegs.length === 1) {
    finalResult = 0;
  } else if (legCount > 2 && pushLegs.length > 0) {
    if (activeLegs.length === 0) {
      finalResult = 0;
    } else if (activeLegs.some((leg) => leg.result === -1)) {
      finalResult = -1;
    } else {
      finalResult = 1;
    }
  } else if (evaluatedLegs.some((leg) => leg.result === -1)) {
    finalResult = -1;
  } else if (evaluatedLegs.some((leg) => leg.result === 0)) {
    finalResult = 0;
  }

  let adjustedOdds = formatDisplayedOdds(odds, 'american');
  if (legCount > 2 && pushLegs.length > 0 && activeLegs.length > 0) {
    adjustedOdds = getAdjustedTeaserOdds(odds, activeLegs.length);
  }

  const firstLegGame = gamesArray.find((game) => legs.some((leg) => String(game.gameId) === String(leg.gameId))) || {};
  const resolvedGameIds = legs.map((leg) => leg.gameId).filter(Boolean);

  return {
    isTeaser: true,
    sport: firstLegGame.sport || wager?.sport || wagerObj.sport,
    year: firstLegGame.year ?? year,
    season: firstLegGame.season ?? season,
    gameWeek: firstLegGame.gameWeek ?? gameWeek,
    gameIdsArray: resolvedGameIds,
    predictionsArray: legs.map((leg) => {
      const legGame = gamesArray.find((game) => String(game.gameId) === String(leg.gameId));
      const prediction = leg.prediction || legGame?.prediction || {};

      return {
        prediction: {
          gameId: leg.gameId,
          awayTeam: prediction.awayTeam,
          homeTeam: prediction.homeTeam,
          odds: prediction.odds,
        },
      };
    }),
    wager: {
      wagerType: 'teaser',
      currency,
      pickCount: activeLegs.length > 0 && legCount > 2 && pushLegs.length > 0 ? activeLegs.length : legCount,
      odds: adjustedOdds,
      legs: evaluatedLegs,
    },
    result: finalResult,
    net: finalResult === 1 ? evaluateNet(adjustedOdds, currency) : finalResult === 0 ? currency : 0,
    settled: true,
  };
}

// module.exports = {
//   calculateTeaser,
//   TEASER_POINTS,
//   formatDisplayedOdds,
// };

exports.handler = async (event) => {
  // console.log('Received event:', JSON.stringify(event, null, 2));
  const { gameId, sport, year, season, gameWeek } = event.Records[0].Sns.MessageAttributes;
  const gameIdValue = parseInt(gameId.Value);
  const sportValue = sport.Value;
  const yearValue = parseInt(year.Value);
  const seasonValue = season.Value;
  const gameWeekValue = parseInt(gameWeek.Value);
  console.log('Extracted attributes:', { gameId: gameIdValue, sport: sportValue, year: yearValue, season: seasonValue, gameWeek: gameWeekValue });
  const client = await MongoClient.connect(MONGO_URL);
  const db = await client.db('pcsm');
  const gamesCollection = db.collection('games');
  const games = await gamesCollection.find({ year: yearValue, season: seasonValue, gameWeek: gameWeekValue }).toArray();
  const wagersCollection = db.collection('wagers');
  const bulkWriteOperations = [];
  const teasers = await wagersCollection.find({ type: 'teaser', sport: sportValue, year: yearValue, season: seasonValue, gameWeek: gameWeekValue, gameIdsArray: { $in: [gameIdValue] } }).toArray();
  console.log(`Found ${teasers.length} teasers for sport: ${sportValue}, year: ${yearValue}, season: ${seasonValue}, gameWeek: ${gameWeekValue}`);
  const calculatedTeasers = teasers.map((wagerObj) => {
    const gamesArray = games.filter((game) => wagerObj.gameIdsArray.includes(game.gameId) && game.status === "final");
    console.log(`Calculating teaser for wager: ${wagerObj._id}, gamesArray: ${gamesArray.length}`);
    if (gamesArray.length < wagerObj.gameIdsArray.length) {
      return {
        status: 200,
        message: 'Not all games are final for this wager.'
      };
    }
    const calculatedTeaser = calculateTeaser(wagerObj, gamesArray);
    console.log('Calculated teaser for wager:', wagerObj._id, 'calculatedTeaser:', JSON.stringify(calculatedTeaser));
    bulkWriteOperations.push({
      updateOne: {
        filter: { _id: wagerObj._id },
        update: { $set: { wager: calculatedTeaser.wager,
          result: calculatedTeaser.result,
          net: calculatedTeaser.net,
          settled: calculatedTeaser.settled
         } }
      }
    });
    return calculatedTeaser;
  });
  console.log('Calculated teasers:', JSON.stringify(calculatedTeasers));
  const bulkWriteResult = await wagersCollection.bulkWrite(bulkWriteOperations);
  console.log('Bulk write result:', JSON.stringify(bulkWriteResult));
  return {
    status: 200,
    message: `${teasers.length} teasers updated.`
  }
}
