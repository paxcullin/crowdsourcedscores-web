'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
const path = require('node:path');

function loadWithMocks(targetPath, mocks) {
    const originalLoad = Module._load;
    Module._load = function(request, parent, isMain) {
        if (Object.prototype.hasOwnProperty.call(mocks, request)) {
            return mocks[request];
        }
        return originalLoad.apply(this, arguments);
    };

    delete require.cache[require.resolve(targetPath)];
    try {
        return require(targetPath);
    } finally {
        Module._load = originalLoad;
    }
}

test('calculateWagers reads completed NBA games from games-nba collection', async () => {
    const requestedCollections = [];

    const db = {
        collection: (name) => {
            requestedCollections.push(name);
            if (name === 'games' || name === 'games-nba') {
                return {
                    findOne: async () => ({
                        gameId: 3001,
                        awayTeam: { participantId: 1 },
                        homeTeam: { participantId: 2 },
                        results: { awayTeam: { score: 101 }, homeTeam: { score: 99 } }
                    })
                };
            }
            if (name === 'wagers') {
                return {
                    find: () => ({ toArray: async () => [] })
                };
            }
            if (name === 'profileExtended') {
                return { bulkWrite: async () => ({ modifiedCount: 0 }) };
            }
            throw new Error(`Unexpected collection: ${name}`);
        }
    };

    const lambdaPath = path.join(__dirname, '..', 'index.js');
    const { handler } = loadWithMocks(lambdaPath, {
        mongodb: { MongoClient: { connect: async () => ({ db: () => db }) } },
        './config': { config: { username: 'u', password: 'p' } }
    });

    const event = {
        Records: [{
            Sns: {
                MessageAttributes: {
                    gameId: { Value: '3001' },
                    sport: { Value: 'nba' }
                }
            }
        }]
    };

    const result = await handler(event, { fail: (err) => { throw err; } }, () => {});

    assert.equal(requestedCollections.includes('games-nba'), true);
    assert.equal(result.message, 'No wagers found');
});
