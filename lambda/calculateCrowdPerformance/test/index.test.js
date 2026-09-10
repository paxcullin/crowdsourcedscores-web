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

test('calculateCrowdPerformance uses gameDate for nba queries and downstream payload', async () => {
    const findQueries = [];
    const updateCriteria = [];
    const downstreamPayloads = [];

    const game = {
        gameId: 4001,
        year: 2026,
        sport: 'nba',
        gameDate: '2026-03-07',
        startDateTime: '2026-03-07T00:00:00.000Z',
        odds: { spread: 1.5, total: 220.5 },
        awayTeam: { code: 'NYK' },
        homeTeam: { code: 'MIA' },
        crowd: {
            awayTeam: { score: 105 },
            homeTeam: { score: 103 }
        },
        results: {
            awayTeam: { score: 104 },
            homeTeam: { score: 101 },
            total: 205
        }
    };

    const db = {
        collection: (name) => {
            if (name === 'games-nba') {
                return {
                    find: (query) => {
                        findQueries.push(query);
                        return { toArray: async () => [JSON.parse(JSON.stringify(game))] };
                    },
                    update: async (criteria) => {
                        updateCriteria.push(criteria);
                        return { ok: 1 };
                    }
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
            downstreamPayloads.push(JSON.parse(command.input.Payload));
            return {};
        }
    }

    const lambdaPath = path.join(__dirname, '..', 'index.js');
    const { handler } = loadWithMocks(lambdaPath, {
        mongodb: { connect: async () => ({ db: () => db }) },
        config: { config: { username: 'u', password: 'p' } },
        '@aws-sdk/client-lambda': { LambdaClient: MockLambdaClient, InvokeCommand: MockInvokeCommand }
    });

    const event = {
        Records: [{
            Sns: {
                MessageAttributes: {
                    gameId: { Value: '4001' },
                    gameDate: { Value: '2026-03-07' },
                    sport: { Value: 'nba' },
                    season: { Value: 'reg' },
                    year: { Value: '2026' }
                }
            }
        }]
    };

    const context = { done: () => {} };
    await handler(event, context);

    assert.equal(findQueries.length, 1);
    assert.equal(findQueries[0].gameDate, '2026-03-07');
    assert.equal(findQueries[0].gameWeek, undefined);
    assert.equal(updateCriteria.length, 1);
    assert.equal(updateCriteria[0].gameDate, '2026-03-07');
    assert.equal(updateCriteria[0].gameWeek, undefined);
    assert.equal(downstreamPayloads.length, 1);
    assert.equal(downstreamPayloads[0].gameDate, '2026-03-07');
    assert.equal(downstreamPayloads[0].gameWeek, undefined);
});
