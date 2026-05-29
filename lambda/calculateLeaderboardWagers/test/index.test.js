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

test('calculateLeaderboardWagers uses gameDate for nba', async () => {
    const aggregatePipelines = [];
    const leaderboardUpdates = [];
    const downstreamPayloads = [];

    const db = {
        collection: (name) => {
            if (name === 'wagers') {
                return {
                    aggregate: (pipeline) => {
                        aggregatePipelines.push(pipeline);
                        return {
                            toArray: async () => [{
                                _id: { userId: 'u1', sport: 'nba', year: 2026, season: 'reg', gameDate: '2026-03-05' },
                                suCorrect: 1,
                                suPush: 0,
                                atsCorrect: 1,
                                atsPush: 0,
                                totalCorrect: 1,
                                totalPush: 0,
                                predictionScore: 6,
                                totalGames: 1
                            }]
                        };
                    }
                };
            }
            if (name === 'leaderboards') {
                return {
                    updateOne: async (criteria) => {
                        leaderboardUpdates.push(criteria);
                        return { acknowledged: true };
                    }
                };
            }
            throw new Error(`Unexpected collection: ${name}`);
        }
    };

    function LambdaMock() {}
    LambdaMock.prototype.invoke = function(params, cb) {
        downstreamPayloads.push(JSON.parse(params.Payload));
        cb(null, { StatusCode: 202 });
    };

    const lambdaPath = path.join(__dirname, '..', 'index.js');
    const { handler } = loadWithMocks(lambdaPath, {
        mongodb: { MongoClient: { connect: async () => ({ db: async () => db }) } },
        './config': { config: { username: 'u', password: 'p' } },
        'aws-sdk': { Lambda: LambdaMock }
    });

    const context = { fail: (err) => { throw err; }, done: () => {} };
    await handler({ sport: 'nba', year: 2026, season: 'reg', gameDate: '2026-03-05' }, context, () => {});
    await new Promise((resolve) => setImmediate(resolve));

    assert.equal(aggregatePipelines.length, 1);
    assert.deepEqual(aggregatePipelines[0][0].$match.gameDate, { $lte: '2026-03-05' });
    assert.equal(leaderboardUpdates[0].gameDate, '2026-03-05');
    assert.equal(leaderboardUpdates[0].gameWeek, undefined);
    assert.equal(downstreamPayloads.length, 1);
    assert.equal(downstreamPayloads[0].gameDate, '2026-03-05');
    assert.equal(downstreamPayloads[0].gameWeek, undefined);
});
