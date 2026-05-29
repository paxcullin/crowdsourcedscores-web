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

test('nba event uses gameDate and invokes downstream even with one game', async () => {
    const predictionQueries = [];
    const invokePayloads = [];

    const gameDoc = {
        year: 2026,
        sport: 'nba',
        season: 'reg',
        gameId: 2001,
        gameDate: '2026-03-04',
        odds: { spread: 2.5, total: 224.5 },
        awayTeam: { code: 'LAL' },
        homeTeam: { code: 'BOS' },
        results: {
            awayTeam: { score: 110 },
            homeTeam: { score: 104 },
            total: 214
        }
    };

    const predictionDoc = {
        userId: 'u1',
        year: 2026,
        sport: 'nba',
        season: 'reg',
        gameId: 2001,
        gameDate: '2026-03-04',
        awayTeam: { code: 'LAL', score: 111 },
        homeTeam: { code: 'BOS', score: 103 },
        total: 214,
        odds: { spread: 2.5, total: 224.5 }
    };

    const db = {
        collection: (name) => {
            if (name === 'games-nba') {
                return {
                    find: (query) => {
                        assert.equal(query.gameDate, '2026-03-04');
                        assert.equal(query.gameWeek, undefined);
                        return { toArray: async () => [gameDoc] };
                    }
                };
            }
            if (name === 'predictions-nba') {
                return {
                    find: (query) => {
                        predictionQueries.push(query);
                        return { toArray: async () => [predictionDoc] };
                    },
                    update: async () => ({ ok: 1 }),
                    updateOne: async () => ({ acknowledged: true })
                };
            }
            throw new Error(`Unexpected collection: ${name}`);
        }
    };

    class MockInvokeCommand {
        constructor(input) {
            this.input = input;
        }
    }

    class MockLambdaClient {
        async send(command) {
            invokePayloads.push(JSON.parse(command.input.Payload));
            return { StatusCode: 202 };
        }
    }

    const lambdaPath = path.join(__dirname, '..', 'index.js');
    const { handler } = loadWithMocks(lambdaPath, {
        mongodb: { MongoClient: { connect: async () => ({ db: () => db }) } },
        config: { config: { username: 'u', password: 'p' } },
        '@aws-sdk/client-lambda': { LambdaClient: MockLambdaClient, InvokeCommand: MockInvokeCommand }
    });

    const event = {
        Records: [{
            Sns: {
                MessageAttributes: {
                    gameId: { Value: '2001' },
                    gameDate: { Value: '2026-03-04' },
                    sport: { Value: 'nba' },
                    season: { Value: 'reg' },
                    year: { Value: '2026' }
                }
            }
        }]
    };

    await handler(event);
    await new Promise((resolve) => setImmediate(resolve));

    assert.equal(predictionQueries.length, 1);
    assert.equal(predictionQueries[0].gameDate, '2026-03-04');
    assert.equal(predictionQueries[0].gameWeek, undefined);
    assert.equal(invokePayloads.length, 1);
    assert.equal(invokePayloads[0].sport, 'nba');
    assert.equal(invokePayloads[0].gameDate, '2026-03-04');
    assert.equal(invokePayloads[0].gameWeek, undefined);
});
