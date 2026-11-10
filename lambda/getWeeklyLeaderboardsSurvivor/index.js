'use strict';

const { MongoClient } = require('mongodb');
const { config } = require('./config');

const MONGO_URI = process.env.MONGODB_URI
  || process.env.MONGO_URI
  || (
    config.username && config.password
      ? `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`
      : null
  );
const MONGO_DB = process.env.MONGODB_DB || 'pcsm';

let cachedClient = null;
let cachedDb = null;

function parseEvent(event = {}) {
  if (!event) {
    return {};
  }

  if (event.body && typeof event.body === 'string') {
    try {
      return { ...event, ...JSON.parse(event.body) };
    } catch (error) {
      return event;
    }
  }

  if (event.body && typeof event.body === 'object') {
    return { ...event, ...event.body };
  }

  return event;
}

function getUserFromEvent(event = {}) {
  const user = event.user || {};
  const nestedUser = user.user || {};

  const userId = event.userId || user.userId || nestedUser.userId || user.id || nestedUser.id;
  const username = event.username || user.username || nestedUser.username || user.preferred_username || nestedUser.preferred_username || user.preferredUsername || nestedUser.preferredUsername;

  return {
    userId,
    username,
    preferred_username: user.preferred_username || nestedUser.preferred_username || user.preferredUsername || nestedUser.preferredUsername,
  };
}

function normalizeValue(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value).trim().toLowerCase();
}

function userMatches(entry = {}, userInfo = {}) {
  const candidateValues = [
    userInfo.userId,
    userInfo.username,
    userInfo.preferred_username,
    entry.userId,
    entry.username,
    entry.preferred_username,
    entry.preferredUsername,
    entry.user && entry.user.userId,
    entry.user && entry.user.username,
    entry.user && entry.user.preferred_username,
    entry.user && entry.user.preferredUsername,
  ];

  const userValues = candidateValues
    .filter((value) => value !== null && value !== undefined && String(value).trim() !== '')
    .map((value) => normalizeValue(value));

  return userValues.length > 0 && userValues.some((value) => value === normalizeValue(userInfo.userId || userInfo.username || userInfo.preferred_username));
}

async function enrichLeaderboardUsers(entries, profileCollection) {
  if (!Array.isArray(entries)) {
    return [];
  }

  return Promise.all(entries.map(async (entry) => {
    if (!entry || typeof entry !== 'object') {
      return entry;
    }

    const lookupValues = [
      entry.username,
      entry.user && entry.user.username,
      entry.preferred_username,
      entry.preferredUsername,
      entry.user && entry.user.preferred_username,
      entry.user && entry.user.preferredUsername,
    ].filter((value) => value !== null && value !== undefined && String(value).trim() !== '');

    let profile = null;

    for (const lookupValue of lookupValues) {
      const profileQuery = {
        $or: [
          { username: lookupValue },
          { preferred_username: lookupValue },
        ],
      };

      profile = await profileCollection.findOne(profileQuery);
      if (profile) {
        break;
      }
    }

    if (profile) {
      entry.preferred_username = entry.preferred_username || profile.preferred_username || profile.username;
      if (entry.user && typeof entry.user === 'object') {
        entry.user.preferred_username = entry.user.preferred_username || profile.preferred_username || profile.username;
      }
    }

    return entry;
  }));
}

async function getDatabase() {
  if (!MONGO_URI) {
    throw new Error('MONGODB_URI or MONGO_URI is not configured. Set it in the Lambda environment or config.js.');
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(MONGO_URI, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
    });

    await cachedClient.connect();
    cachedDb = cachedClient.db(MONGO_DB);
  }

  return cachedDb;
}

function getRequestedWeek(event = {}) {
  const rawWeek = event.week ?? event.gameWeek ?? event.game_date ?? event.gameDate;
  return rawWeek !== undefined && rawWeek !== null && rawWeek !== '' ? Number(rawWeek) : null;
}

function findUserEntry(overallEntries, weeklyEntries, userInfo) {
  const normalizedUserInfo = userInfo || {};
  const userKey = normalizeValue(normalizedUserInfo.userId || normalizedUserInfo.username || normalizedUserInfo.preferred_username);

  if (!userKey) {
    return null;
  }

  const overallMatch = (overallEntries || []).find((entry) => {
    const values = [
      entry.userId,
      entry.username,
      entry.preferred_username,
      entry.preferredUsername,
      entry.user && entry.user.userId,
      entry.user && entry.user.username,
      entry.user && entry.user.preferred_username,
      entry.user && entry.user.preferredUsername,
    ].map(normalizeValue);

    return values.includes(userKey);
  });

  if (overallMatch) {
    return { overall: overallMatch };
  }

  for (const weekEntry of weeklyEntries || []) {
    const match = (weekEntry.users || []).find((entry) => {
      const values = [
        entry.userId,
        entry.username,
        entry.preferred_username,
        entry.preferredUsername,
        entry.user && entry.user.userId,
        entry.user && entry.user.username,
        entry.user && entry.user.preferred_username,
        entry.user && entry.user.preferredUsername,
      ].map(normalizeValue);

      return values.includes(userKey);
    });

    if (match) {
      return { weekly: weekEntry, user: match };
    }
  }

  return null;
}

exports.handler = async (event = {}) => {
  try {
    const payload = parseEvent(event);
    const { year, season, sport, week, gameWeek, gameDate, user, userId, username } = payload;
    const requestedUser = {
      ...getUserFromEvent(payload),
      userId: payload.userId || user?.userId || user?.id || userId,
      username: payload.username || user?.username || username || user?.preferred_username || user?.preferredUsername,
    };

    if (!year || !season || !sport) {
      return {
        statusCode: 400,
        message: 'Missing required fields: year, season, and sport.',
      };
    }

    const normalizedYear = Number(year);
    const normalizedSeason = String(season).toLowerCase();
    const normalizedSport = String(sport).toLowerCase();
    const normalizedWeek = getRequestedWeek(payload);

    if (!normalizedWeek && !gameDate) {
      return {
        statusCode: 400,
        message: 'Missing required field: week or gameDate.',
      };
    }

    const db = await getDatabase();
    const leaderboardCollection = db.collection('survivorLeaderboards');
    const profileExtendedCollection = db.collection('profileExtended');

    const query = {
      sport: normalizedSport,
      season: normalizedSeason,
      year: normalizedYear,
    };

    if (gameDate) {
      query.gameDate = String(gameDate);
    } else if (normalizedWeek !== null) {
      query.gameWeek = normalizedWeek;
    }

    const leaderboard = await leaderboardCollection.findOne(query);

    if (!leaderboard) {
      return {
        statusCode: 404,
        message: 'No survivor leaderboard found for the provided criteria.',
        weekly: [],
        overall: [],
        user: null,
      };
    }

    const weeklyEntries = Array.isArray(leaderboard.weekly)
      ? leaderboard.weekly
      : Array.isArray(leaderboard.weekly?.users)
        ? [{ gameWeek: normalizedWeek, users: leaderboard.weekly.users }]
        : [];

    const overallEntries = Array.isArray(leaderboard.overall)
      ? leaderboard.overall
      : Array.isArray(leaderboard.overall?.users)
        ? leaderboard.overall.users
        : [];

    const enrichedOverall = await enrichLeaderboardUsers(overallEntries, profileExtendedCollection);
    const enrichedWeekly = await Promise.all(
      weeklyEntries.map(async (entry) => ({
        ...entry,
        users: await enrichLeaderboardUsers(entry.users || [], profileExtendedCollection),
      }))
    );

    const userEntry = findUserEntry(enrichedOverall, enrichedWeekly, requestedUser);

    return {
      statusCode: 200,
      message: 'Survivor leaderboard retrieved successfully.',
      year: normalizedYear,
      season: normalizedSeason,
      sport: normalizedSport,
      week: normalizedWeek,
      weekly: enrichedWeekly,
      overall: enrichedOverall,
      user: userEntry,
      updatedAt: leaderboard.updatedAt || null,
    };
  } catch (error) {
    console.error('getWeeklyLeaderboardsSurvivor error:', error);
    return {
      statusCode: 500,
      message: 'Failed to retrieve survivor leaderboard.',
      error: error.message,
      weekly: [],
      overall: [],
      user: null,
    };
  }
};

if (require.main === module) {
  exports.handler({
    year: 2026,
    season: 'reg',
    sport: 'nfl',
    week: 1,
    user: {
      username: 'sample-user',
    },
  }).then((result) => {
    console.log(JSON.stringify(result, null, 2));
  }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
