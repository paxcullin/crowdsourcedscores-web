'use strict';

const { MongoClient } = require('mongodb');
const {config} = require("./config");
const MONGO_URI = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

let cachedClient = null;
let cachedDb = null;

function normalizeTeamCode(value) {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'object') {
    const candidate = value.survivorTeamCode || value.teamCode || value.code || value.abbreviation || value.value || value.label || value.name;
    return normalizeTeamCode(candidate);
  }

  return String(value).trim().toUpperCase();
}

function getUserKey(pick) {
  return pick.userId || pick.username || pick.user || pick.memberId || 'unknown-user';
}

function getSurvivorPickCode(pick) {
  if (!pick) {
    return '';
  }

  if (typeof pick === 'string' || typeof pick === 'number') {
    return normalizeTeamCode(pick);
  }

  if (typeof pick === 'object') {
    return normalizeTeamCode(
      pick.survivorTeamCode ||
      pick.teamCode ||
      pick.code ||
      pick.abbreviation ||
      pick.value ||
      pick.team ||
      pick.teamName ||
      pick.shortName
    );
  }

  return '';
}

function getGameWinnerCode(game) {
  const homeTeam = game?.homeTeam || game?.home || {};
  const awayTeam = game?.awayTeam || game?.away || {};

  const homeScore = Number(
    game?.results?.homeTeam?.score
  );

  const awayScore = Number(
    game?.results?.awayTeam?.score
  );

  if (!Number.isFinite(homeScore) || !Number.isFinite(awayScore)) {
    return null;
  }

  const homeCode = normalizeTeamCode(homeTeam.code || homeTeam.teamCode || homeTeam.abbreviation || homeTeam.shortName || game?.homeTeamCode || game?.homeCode);
  const awayCode = normalizeTeamCode(awayTeam.code || awayTeam.teamCode || awayTeam.abbreviation || awayTeam.shortName || game?.awayTeamCode || game?.awayCode);

  if (homeScore > awayScore) {
    return homeCode || null;
  }

  if (awayScore > homeScore) {
    return awayCode || null;
  }

  return null;
}

async function getDatabase() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || MONGO_URI;
  const dbName = process.env.MONGODB_DB || 'pcsm';

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured. Set MONGODB_URI or MONGO_URI before running this lambda.');
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(mongoUri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
    });

    await cachedClient.connect();
    cachedDb = cachedClient.db(dbName);
  }

  return cachedDb;
}

async function calculateSurvivorLeaderboard({
  sport = 'nfl',
  year = new Date().getFullYear(),
  season = 'reg',
  gameWeek,
  leaderboardCollection = 'survivorLeaderboards',
} = {}) {
  const db = await getDatabase();
  const predictionsCollection = db.collection('predictions');
  const gamesCollection = db.collection('games');

  const seasonYear = Number(year);
  const normalizedSport = String(sport).toLowerCase();
  const normalizedSeason = String(season).toLowerCase();

  const predictionFilter = {
    sport: normalizedSport,
    year: seasonYear,
    season: normalizedSeason,
    isSurvivorPick: true,
  };

  if (gameWeek !== undefined && gameWeek !== null && gameWeek !== '') {
    predictionFilter.gameWeek = Number(gameWeek);
  }

  const pickDocs = await predictionsCollection.find(predictionFilter).toArray();
  const gameFilter = {
    sport: normalizedSport,
    year: seasonYear,
    season: normalizedSeason,
  };

  if (gameWeek !== undefined && gameWeek !== null && gameWeek !== '') {
    gameFilter.gameWeek = Number(gameWeek);
  }

  const gameDocs = await gamesCollection.find(gameFilter).toArray();

  const weeksInSeason = [...new Set([
    ...gameDocs.map((game) => Number(game.gameWeek)).filter(Number.isFinite),
    ...pickDocs.map((pick) => Number(pick.gameWeek)).filter(Number.isFinite),
  ])].sort((a, b) => a - b);

  const winningTeamsByWeek = new Map();

  for (const game of gameDocs) {
    const gameWeekNumber = Number(game.gameWeek);
    if (!Number.isFinite(gameWeekNumber)) {
      continue;
    }

    const winnerCode = getGameWinnerCode(game);
    if (!winnerCode) {
      continue;
    }

    const existing = winningTeamsByWeek.get(gameWeekNumber) || new Set();
    existing.add(normalizeTeamCode(winnerCode));
    winningTeamsByWeek.set(gameWeekNumber, existing);
  }

  const userEntries = new Map();

  for (const userId of new Set(pickDocs.map(getUserKey))) {
    userEntries.set(userId, {
      userId,
      correctWeeks: 0,
      longestStreak: 0,
      totalPoints: 0,
      currentStreak: 0,
      weekly: {},
    });
  }

  const picksByUser = new Map();

  for (const pick of pickDocs) {
    const userId = getUserKey(pick);
    const weekNumber = Number(pick.gameWeek);
    const pickCode = getSurvivorPickCode(pick.survivorPick || pick.survivorTeamCode || pick.teamCode);

    if (!Number.isFinite(weekNumber) || !pickCode) {
      continue;
    }

    if (!picksByUser.has(userId)) {
      picksByUser.set(userId, new Map());
    }

    picksByUser.get(userId).set(weekNumber, pickCode);
  }

  for (const weekNumber of weeksInSeason) {
    const winningTeamsForWeek = winningTeamsByWeek.get(weekNumber) || new Set();

    for (const [userId, userRecord] of userEntries.entries()) {
      const selectedTeamCode = picksByUser.get(userId)?.get(weekNumber) || '';
      const isCorrect = !!selectedTeamCode && winningTeamsForWeek.has(normalizeTeamCode(selectedTeamCode));

      if (selectedTeamCode && isCorrect) {
        userRecord.currentStreak += 1;
      } else {
        userRecord.currentStreak = 0;
      }

      if (selectedTeamCode && isCorrect) {
        userRecord.correctWeeks += 1;
        const points = userRecord.currentStreak;
        userRecord.totalPoints += points;
        userRecord.longestStreak = Math.max(userRecord.longestStreak, userRecord.currentStreak);
        userRecord.weekly[weekNumber] = {
          gameWeek: weekNumber,
          userId,
          selectedTeamCode,
          correct: true,
          streak: userRecord.currentStreak,
          multiplier: userRecord.currentStreak,
          points,
        };
      } else {
        userRecord.weekly[weekNumber] = {
          gameWeek: weekNumber,
          userId,
          selectedTeamCode,
          correct: false,
          streak: 0,
          multiplier: 0,
          points: 0,
        };
      }
    }
  }

  const overallLeaderboard = Array.from(userEntries.values())
    .map((entry) => ({
      userId: entry.userId,
      totalPoints: entry.totalPoints,
      correctWeeks: entry.correctWeeks,
      longestStreak: entry.longestStreak,
      currentStreak: entry.currentStreak,
    }))
    .sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      if (b.longestStreak !== a.longestStreak) {
        return b.longestStreak - a.longestStreak;
      }
      return String(a.userId).localeCompare(String(b.userId));
    });

  const weeklyLeaderboard = weeksInSeason.map((weekNumber) => {
    const weekEntries = Array.from(userEntries.values())
      .map((entry) => ({
        userId: entry.userId,
        selectedTeamCode: entry.weekly[weekNumber]?.selectedTeamCode || '',
        correct: entry.weekly[weekNumber]?.correct || false,
        streak: entry.weekly[weekNumber]?.streak || 0,
        multiplier: entry.weekly[weekNumber]?.multiplier || 0,
        points: entry.weekly[weekNumber]?.points || 0,
      }))
      .sort((a, b) => {
        if (b.points !== a.points) {
          return b.points - a.points;
        }
        if (b.streak !== a.streak) {
          return b.streak - a.streak;
        }
        return String(a.userId).localeCompare(String(b.userId));
      });

    return {
      gameWeek: weekNumber,
      users: weekEntries,
    };
  });

  const leaderboardDoc = {
    sport: normalizedSport,
    season: normalizedSeason,
    year: seasonYear,
    updatedAt: new Date(),
    weekly: weeklyLeaderboard,
    overall: overallLeaderboard,
  };

  if (gameWeek !== undefined && gameWeek !== null && gameWeek !== '') {
    leaderboardDoc.gameWeek = Number(gameWeek);
  }

  await db.collection(leaderboardCollection).updateOne(
    {
      sport: normalizedSport,
      season: normalizedSeason,
      year: seasonYear,
      ...(gameWeek !== undefined && gameWeek !== null && gameWeek !== '' ? { gameWeek: Number(gameWeek) } : {}),
    },
    { $set: leaderboardDoc },
    { upsert: true }
  );

  return {
    statusCode: 200,
    sport: normalizedSport,
    season: normalizedSeason,
    year: seasonYear,
    weekly: weeklyLeaderboard,
    overall: overallLeaderboard,
    updatedAt: leaderboardDoc.updatedAt,
  };
}

exports.handler = async (event = {}) => {
  try {
    return await calculateSurvivorLeaderboard(event);
  } catch (error) {
    console.error('calculateSurvivorLeaderboard error:', error);
    return {
      statusCode: 500,
      message: 'Failed to calculate survivor leaderboard',
      error: error.message,
    };
  }
};

if (require.main === module) {
  calculateSurvivorLeaderboard({
    sport: 'nfl',
    year: 2026,
    season: 'reg',
  }).then((result) => {
    console.log(JSON.stringify(result, null, 2));
  }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
