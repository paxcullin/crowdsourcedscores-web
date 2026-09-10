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

test('calculateLeaders uses gameDate criteria/payload for nba', async () => {
    global.AWSConfig = { region: 'us-west-2' };
    const updates = [];
    const payloads = [];
    const aggregatePipelines = [];

    const db = {
        collection: (name) => {
            if (name === 'games-nba') {
                return {
                    aggregate: (pipeline) => {
                        aggregatePipelines.push(pipeline);
                        return {
                            toArray: async () => [{
                                _id: { sport: 'nba', year: 2026, season: 'reg', gameDate: '2026-03-04' },
                                suCorrect: 4,
                                suPush: 0,
                                atsCorrect: 3,
                                atsPush: 1,
                                totalCorrect: 2,
                                totalPush: 1,
                                predictionScore: 20,
                                totalGames: 5
                            }]
                        };
                    }
                };
            }
            if (name === 'leaderboards') {
                return {
                    updateOne: async (criteria, update, opts) => {
                        updates.push({ criteria, update, opts });
                        return { acknowledged: true };
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
            payloads.push(JSON.parse(command.input.Payload));
            return {};
        }
    }

    const lambdaPath = path.join(__dirname, '..', 'index.js');
    const { handler } = loadWithMocks(lambdaPath, {
        mongodb: { connect: async () => ({ db: () => db }) },
        './config': { config: { username: 'u', password: 'p' } },
        '@aws-sdk/client-lambda': { LambdaClient: MockLambdaClient, InvokeCommand: MockInvokeCommand }
    });

    await handler({ sport: 'nba', year: 2026, season: 'reg', gameDate: '2026-03-04' }, {}, () => {});

    assert.equal(aggregatePipelines.length, 1);
    assert.deepEqual(aggregatePipelines[0][0].$match.gameDate, { $lte: '2026-03-04' });
    assert.equal(updates.length, 1);
    assert.equal(updates[0].criteria.gameDate, '2026-03-04');
    assert.equal(updates[0].criteria.gameWeek, undefined);
    assert.equal(payloads.length, 1);
    assert.equal(payloads[0].gameDate, '2026-03-04');
    assert.equal(payloads[0].gameWeek, undefined);

    delete global.AWSConfig;
});

test('calculateLeaders keeps gameWeek behavior for nfl', async () => {
    global.AWSConfig = { region: 'us-west-2' };
    const updates = [];
    const payloads = [];

    const db = {
        collection: (name) => {
            if (name === 'games') {
                return {
                    aggregate: () => ({
                        toArray: async () => [{
                            _id: { sport: 'nfl', year: 2026, season: 'reg', gameWeek: 10 },
                            suCorrect: 10,
                            suPush: 0,
                            atsCorrect: 8,
                            atsPush: 1,
                            totalCorrect: 7,
                            totalPush: 1,
                            predictionScore: 50,
                            totalGames: 12
                        }]
                    })
                };
            }
            if (name === 'leaderboards') {
                return {
                    updateOne: async (criteria) => {
                        updates.push(criteria);
                        return { acknowledged: true };
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
            payloads.push(JSON.parse(command.input.Payload));
            return {};
        }
    }

    const lambdaPath = path.join(__dirname, '..', 'index.js');
    const { handler } = loadWithMocks(lambdaPath, {
        mongodb: { connect: async () => ({ db: () => db }) },
        './config': { config: { username: 'u', password: 'p' } },
        '@aws-sdk/client-lambda': { LambdaClient: MockLambdaClient, InvokeCommand: MockInvokeCommand }
    });

    await handler({ sport: 'nfl', year: 2026, season: 'reg', gameWeek: 10 }, {}, () => {});

    assert.equal(updates[0].gameWeek, 10);
    assert.equal(payloads[0].gameWeek, 10);

    delete global.AWSConfig;
});
